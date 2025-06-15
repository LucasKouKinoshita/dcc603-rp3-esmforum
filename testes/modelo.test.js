const bd = require('../bd/bd_utils.js');
const modelo = require('../modelo.js');

beforeEach(() => {
  bd.reconfig('./bd/esmforum-teste.db');
  // limpa dados de todas as tabelas
  bd.exec('delete from perguntas', []);
  bd.exec('delete from respostas', []);
});

test('Testando banco de dados vazio', () => {
  expect(modelo.listar_perguntas().length).toBe(0);
});

test('Testando cadastro de três perguntas', () => {
  modelo.cadastrar_pergunta('1 + 1 = ?');
  modelo.cadastrar_pergunta('2 + 2 = ?');
  modelo.cadastrar_pergunta('3 + 3 = ?');
  const perguntas = modelo.listar_perguntas(); 
  expect(perguntas.length).toBe(3);
  expect(perguntas[0].texto).toBe('1 + 1 = ?');
  expect(perguntas[1].texto).toBe('2 + 2 = ?');
  expect(perguntas[2].num_respostas).toBe(0);
  expect(perguntas[1].id_pergunta).toBe(perguntas[2].id_pergunta-1);
});

test('Testando get_pergunta', () => {
  const texto_pergunta = 'Qual a capital do Brasil?';
  const id_pergunta = modelo.cadastrar_pergunta(texto_pergunta);
  const pergunta = modelo.get_pergunta(id_pergunta);
  expect(pergunta.id_pergunta).toBe(id_pergunta);
  expect(pergunta.texto).toBe(texto_pergunta);
  expect(pergunta.id_usuario).toBe(1); 
});

test('Testando cadastro de respostas e get_respostas', () => {
  const id_pergunta = modelo.cadastrar_pergunta('Qual o melhor framework de teste para JS?');
  modelo.cadastrar_resposta(id_pergunta, 'Jest');
  modelo.cadastrar_resposta(id_pergunta, 'Mocha');
  const respostas = modelo.get_respostas(id_pergunta);
  expect(respostas.length).toBe(2);
  expect(respostas[0].texto).toBe('Jest');
  expect(respostas[1].texto).toBe('Mocha');
  expect(respostas[0].id_pergunta).toBe(id_pergunta);
});

test('Testando get_num_respostas', () => {
  const id_p1 = modelo.cadastrar_pergunta('Pergunta com respostas');
  const id_p2 = modelo.cadastrar_pergunta('Pergunta sem respostas');
  modelo.cadastrar_resposta(id_p1, 'Resposta 1');
  modelo.cadastrar_resposta(id_p1, 'Resposta 2');
  const num_respostas_p1 = modelo.get_num_respostas(id_p1);
  const num_respostas_p2 = modelo.get_num_respostas(id_p2);
  expect(num_respostas_p1).toBe(2);
  expect(num_respostas_p2).toBe(0);
});

test('Testando listar_perguntas com contagem de respostas correta', () => {
  const id_p1 = modelo.cadastrar_pergunta('Qual a cor do céu?');
  const id_p2 = modelo.cadastrar_pergunta('Qual a cor da grama?');
  const id_p3 = modelo.cadastrar_pergunta('Qual a cor do sol?');
  modelo.cadastrar_resposta(id_p1, 'Azul');
  modelo.cadastrar_resposta(id_p1, 'Às vezes cinza');
  modelo.cadastrar_resposta(id_p3, 'Amarelo');
  const perguntas = modelo.listar_perguntas();
  const p1 = perguntas.find(p => p.id_pergunta === id_p1);
  const p2 = perguntas.find(p => p.id_pergunta === id_p2);
  const p3 = perguntas.find(p => p.id_pergunta === id_p3);
  expect(p1.num_respostas).toBe(2);
  expect(p2.num_respostas).toBe(0);
  expect(p3.num_respostas).toBe(1);
});