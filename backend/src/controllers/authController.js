const { User } = require('../../models');

async function googleLogin(req, res) {
  try {
    const firebaseUid = req.user.uid;
    const email = req.user.email || req.body?.email;
    const name = req.user.name || req.body?.name || 'Usuário';
    const photoUrl = req.user.picture || req.body?.photoUrl || null;

    if (!email) {
      return res.status(400).json({ message: 'Email não encontrado no token.' });
    }

    const [user] = await User.findOrCreate({
      where: { firebaseUid },
      defaults: {
        firebaseUid,
        email,
        name,
        photoUrl,
      },
    });

    if (user.name !== name || user.email !== email || user.photoUrl !== photoUrl) {
      user.name = name;
      user.email = email;
      user.photoUrl = photoUrl;
      await user.save();
    }

    return res.status(200).json({
      message: 'Login validado com sucesso.',
      user,
      tokenClaims: req.user,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Erro ao validar login com Google.',
      detail: error.message,
    });
  }
}

async function getMe(req, res) {
  try {
    const user = await User.findOne({ where: { firebaseUid: req.user.uid } });

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado no banco.' });
    }

    return res.status(200).json({
      user,
      tokenClaims: req.user,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao buscar usuário.' });
  }
}

module.exports = {
  googleLogin,
  getMe,
};
