const bcrypt = require('bcryptjs');
const { json } = require('body-parser');
const Usuario = require('../models/Usuario');
const { generarJWT } = require('../helpers/jwt');

const crearUsuario = async (req, res) => {
  const { email, password } = req.body;

  try {
    let usuario = await Usuario.findOne({ email });

    if (usuario) {
      return res.status(400).json({
        ok: false,
        msg: 'Ya existe un usuario con este correo',
      });
    }

    usuario = new Usuario(req.body);

    //Encripto la contraseña
    const salt = bcrypt.genSaltSync();
    usuario.password = bcrypt.hashSync(password, salt);

    await usuario.save();

    //Genero JWT
    const token = await generarJWT(usuario.id, usuario.name);

    return res.status(201).json({
      ok: true,
      uid: usuario.id,
      name: usuario.name,
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: 'Por favor, hable con el Administrador',
    });
  }
};

const loginUsuario = async (req, res) => {
  const { email, password } = req.body;

  try {
    //Compruebo que existe un usuario con este email
    const usuario = await Usuario.findOne({ email });

    if (!usuario) {
      return res.status(400).json({
        ok: false,
        msg: 'No existe un usuario con este correo',
      });
    }

    //Confirmo los passwords
    const validPassword = bcrypt.compareSync(password, usuario.password);

    if (!validPassword) {
      return res.status(400).json({
        ok: false,
        msg: 'Password incorrecto',
      });
    }

    //Genero JWT
    const token = await generarJWT(usuario.id, usuario.name);

    return res.json({
      ok: true,
      uid: usuario.id,
      name: usuario.name,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status().json({
      ok: false,
      msg: 'Por favor, hable con el Administrador',
    });
  }
};

const revalidarToken = async (req, res) => {
  const { uid, name } = req;

  //Genero un nuevo JWT y lo devuelvo en esta petición
  const token = await generarJWT(uid, name);

  return res.json({
    ok: true,
    uid,
    name,
    token,
  });
};

module.exports = {
  crearUsuario,
  loginUsuario,
  revalidarToken,
};
