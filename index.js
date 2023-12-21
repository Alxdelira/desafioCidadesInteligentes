const { createHash } = require('crypto');


// Classe para criar um usuário - Atributos do usuário
class Usuario {
  constructor(nome, email, senha, ativo, permissoes) {
    this.id = uuidv4()
    this.nome = nome;
    this.email = email;
    this.senha = senha;
    this.ativo = ativo;
    this.permissoes = permissoes;
    this.dataCriacao = new Date();
    this.dataLogin = null;
  }
}

// função para criar um ID único
function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = Math.random() * 16 | 0;
    const v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Função para criar um hash da senha
function hashSenha(senha) {
  const hash = createHash('sha256').update(senha).digest('hex');
  return hash;
}
// Função para validar a senha
function validarSenha(senha) {
  if (senha.length < 8) {
    throw new Error('A senha deve ter no mínimo 8 caracteres');
  }
  if (!/[a-z]/.test(senha)) {
    throw new Error('A senha deve conter letras minúsculas');
  }

  if (!/[A-Z]/.test(senha)) {
    throw new Error('A senha deve conter letras maiúsculas');
  }

  if (!/\d/.test(senha)) {
    throw new Error('A senha deve conter números');
  }

  if (!/[^a-zA-Z0-9]/.test(senha)) {
    throw new Error('A senha deve conter caracteres especiais');
  }
}

const usuarios = []; // Array para armazenar os usuários

function criarUsuario(nome, email, senha, ativo, permissoes) {

  // Validações
  if (!nome) {
    throw new Error('O nome é obrigatório');
  }
  if (!email) {
    throw new Error('O email é obrigatório');
  }
  if (!email.includes('@')) {
    throw new Error('O email deve ser válido');
  }
  const emailJaCadastrado = usuarios.some(usuario => usuario.email === email);
  if (emailJaCadastrado) {
    throw new Error('O email já está cadastrado');
  }
  if (!senha) {
    throw new Error('A senha é obrigatório');
  }
  if (ativo === undefined) {
    throw new Error('O status é obrigatório');
  }
  if (!permissoes) {
    throw new Error('As permissões são obrigatórias');
  }
  // Fim das validações

  // Cria o usuário
  const usuario = new Usuario(nome, email, senha, ativo, permissoes);
  usuarios.push(usuario);  // Adiciona o usuário no array de usuários
  return usuario;
}

// Função para listar todos os usuários
function listarUsuarios() {
  return usuarios;
}


// Parte para criar um usuário - Criar um novo usuário com os atributos mencionados.
try {
  const senha = 'Senha@123456'; 
  validarSenha(senha); // Valida a senha
  const senhaHash = hashSenha(senha); // Hash da senha
  criarUsuario(
    'Marco Andrade', // Nome
    'marco.andrade@gmail.com', // E-mail
    senhaHash, // Senha
    true, // Ativo
    ['admin'],   // Permissões


  );
  const usuariosCadastrados = listarUsuarios();
  console.log('Usuários Cadastrados:', usuariosCadastrados);
} catch (error) {
  console.error(error.message);
}


// Função para alterar um usuário por ID
function encontrarUsuarioPorId(id) {
  return usuarios.find(usuario => usuario.id === id);
}
// Função para alterar um usuário por ID
function alterarUsuario(id, novoNome, novoEmail, novaSenha, novoStatus, novasPermissoes) {
  const usuarioExistente = encontrarUsuarioPorId(id);

  if (!usuarioExistente) {
    throw new Error('Usuário não encontrado');
  }

  if (novoNome) {
    usuarioExistente.nome = novoNome;
  }

  if (novoEmail) {
    usuarioExistente.email = novoEmail;
  }

  if (novaSenha) {
    const novaSenhaHash = hashSenha(novaSenha); // Hash da nova senha
    usuarioExistente.senha = novaSenhaHash; // Atualiza a senha hashada
  }

  if (novoStatus !== undefined) {
    usuarioExistente.ativo = novoStatus;
  }

  if (novasPermissoes) {
    usuarioExistente.permissoes = novasPermissoes;
  }

  return usuarioExistente;
}

// Exemplo de uso para alterar um usuário por ID
try {
  const novaSenha = 'nova@Senha123456'; // Nova senha do usuário
  const novaSenhaHash = hashSenha(novaSenha); // Hash da nova senha
  const usuarioAlterado = alterarUsuario(
    usuarios[0].id, // ID do usuário a ser alterado (vendo que o primeiro usuário seja o que acabou de ser criado)
    'Gilberto Andrade', // Novo nome
    undefined, // Mantém o e-mail atual
    novaSenhaHash, // Atualiza a senha hashada
    true, // Novo status
    ['user'] // Novas permissões
  );

  console.log('Usuário Alterado:', usuarioAlterado);
} catch (error) {
  console.error(error.message);
}


// Função para Login e Logout
function fazerLogin(email, senha) {
  const usuario = usuarios.find(user => user.email === email);

  if (usuario && usuario.senha === hashSenha(senha)) {
    usuario.dataLogin = new Date();
    return usuario;
  } else {
    throw new Error('Credenciais inválidas. Verifique seu email e senha.');
  }
}




function fazerLogout(id) {
  
  const usuario = usuarios.find(user => user.id === id);

  if (usuario) {
    usuario.dataLogin = null;
    return 'Logout feito com sucesso.';
  } else {
    throw new Error('Usuário não encontrado.');
  }
}





///////////////////////////////////// Parte de testes do Usuario //////////////////////////////////////////

// Criar um novo usuário
try {
  const senha = 'Senha@123456'; // Senha original
  validarSenha(senha); // Valida a senha
  const senhaHash = hashSenha(senha); // Hash da senha

  // Criar um novo usuário
  criarUsuario(
    'Mateus de Moraes', // Nome
    'mateus.moraes@gmail.com', // E-mail
    senhaHash, // Senha
    true, // Ativo
    ['user'] // Permissões
  );

  console.log('Novo usuário criado com sucesso!');
} catch (error) {
  console.error('Erro ao criar usuário:', error.message);
}

// Alterar os dados de um usuário existente
try {
  const usuarioExistente = encontrarUsuarioPorId(usuarios[0].id); // Primeiro usuário da lista como exemplo

  // Alterar dados do usuário
  const usuarioAlterado = alterarUsuario(
    usuarioExistente.id, // ID do usuário a ser alterado
    'Jose Junior', // Novo nome
    'jose.das.planilhas@gmail.com', // Novo e-mail
    'novaSenha@123', // Nova senha
    false, // Novo status (ativo/inativo)
    ['admin', 'user'] // Novas permissões
  );

  console.log('Usuário alterado com sucesso:', usuarioAlterado);
} catch (error) {
  console.error('Erro ao alterar usuário:', error.message);
}

// Ativar/desativar usuários
try {
  const usuarioExistente = encontrarUsuarioPorId(usuarios[1].id); // Segundo usuário da lista como exemplo

  // Alterar status do usuário
  const usuarioAtualizado = alterarUsuario(
    usuarioExistente.id, // ID do usuário a ser alterado
    undefined, // Mantém o nome atual
    undefined, // Mantém o e-mail atual
    undefined, // Mantém a senha atual
    !usuarioExistente.ativo, // Inverte o status atual do usuário
    undefined // Mantém as permissões atuais
  );

  console.log('Status do usuário alterado com sucesso:', usuarioAtualizado);
} catch (error) {
  console.error('Erro ao alterar status do usuário:', error.message);
}

// Excluir um usuário
try {
  const usuarioParaExcluir = encontrarUsuarioPorId(usuarios[1].id); // Terceiro usuário da lista como exemplo

  // Remover usuário
  usuarios.splice(usuarios.indexOf(usuarioParaExcluir), 1);

  console.log('Usuário excluído com sucesso!');
} catch (error) {
  console.error('Erro ao excluir usuário:', error.message);
}

// Listar todos os usuários cadastrados
try {
  const usuariosCadastrados = listarUsuarios();
  console.log('Usuários cadastrados:', usuariosCadastrados);
} catch (error) {
  console.error('Erro ao listar usuários:', error.message);
}

// Login e logout
try {
  const senha = 'senha@123'; // Senha original
  const senhaHash = hashSenha(senha); // Hash da senha
  criarUsuario(
    'Marco Andrade Login', // Nome
    'marco.login@gmail.com', // E-mail
    senhaHash, // Senha
    true, // Ativo
    ['admin'],   // Permissões
  );

  const usuarioLogado = fazerLogin('marco.login@gmail.com', 'senha@123');
  console.log('Usuário Logado:', usuarioLogado);

  const usuarioDeslogado = fazerLogout(usuarioLogado.id);
  console.log(usuarioDeslogado);
} catch (error) {
  console.error(error.message);
}
