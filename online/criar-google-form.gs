/**
 * Semedo & Corrêa — Formulário de Perfil de Investidor (Google Forms)
 *
 * Como usar:
 * 1. Abra https://script.google.com com a conta Google da empresa e clique em "Novo projeto".
 * 2. Apague o conteúdo do editor e cole este ficheiro inteiro.
 * 3. Clique em "Executar" (função criarFormulario) e autorize o acesso quando o Google pedir.
 * 4. Abra "Registo de execução": aparecem os links do formulário e da folha de respostas.
 *
 * O formulário não pede login a quem responde. As respostas vão para uma folha do Google Sheets.
 */
function criarFormulario() {
  var form = FormApp.create('Perfil de Investidor – Semedo & Corrêa');
  form.setDescription(
    'A Semedo & Corrêa atua na Área Metropolitana de Lisboa e procura conhecer as zonas de interesse ' +
    'dos seus investidores, para lhes apresentar oportunidades imobiliárias ajustadas aos seus perfis ' +
    'e objetivos. Pode escolher várias opções sempre que se aplicar.');
  form.setCollectEmail(false);
  form.setAllowResponseEdits(true);
  form.setProgressBar(true);
  form.setConfirmationMessage('Obrigado! Recebemos o seu perfil de investidor. A Semedo & Corrêa entrará em contacto consigo.');

  function seccao(titulo, ajuda) {
    var s = form.addPageBreakItem().setTitle(titulo);
    if (ajuda) s.setHelpText(ajuda);
  }
  function caixas(titulo, opcoes, outros, ajuda) {
    var i = form.addCheckboxItem().setTitle(titulo).setChoiceValues(opcoes);
    if (outros) i.showOtherOption(true);
    if (ajuda) i.setHelpText(ajuda);
    return i;
  }
  function escolhaUnica(titulo, opcoes, outros) {
    var i = form.addMultipleChoiceItem().setTitle(titulo).setChoiceValues(opcoes);
    if (outros) i.showOtherOption(true);
    return i;
  }

  // 1. Dados do investidor
  form.addSectionHeaderItem().setTitle('1. Dados do investidor');
  form.addTextItem().setTitle('Nome').setRequired(true);
  form.addTextItem().setTitle('Telefone');
  form.addTextItem().setTitle('E-mail').setRequired(true)
    .setValidation(FormApp.createTextValidation().requireTextIsEmail()
      .setHelpText('Indique um e-mail válido.').build());

  // 2. Zonas de interesse
  seccao('2. Zonas de interesse', 'Assinale todas as localidades que lhe interessam.');
  caixas('Grande Lisboa – Margem Norte',
    ['Lisboa', 'Sintra', 'Amadora', 'Odivelas', 'Oeiras', 'Cascais', 'Loures', 'Vila Franca de Xira', 'Mafra']);
  caixas('Distrito de Setúbal – Margem Sul e restantes',
    ['Almada', 'Seixal', 'Barreiro', 'Moita', 'Montijo', 'Alcochete', 'Sesimbra', 'Palmela', 'Setúbal',
     'Alcácer do Sal', 'Grândola', 'Santiago do Cacém', 'Sines']);
  caixas('Zona Oeste',
    ['Torres Vedras', 'Alenquer', 'Arruda dos Vinhos', 'Sobral de Monte Agraço', 'Lourinhã', 'Cadaval',
     'Bombarral', 'Óbidos', 'Caldas da Rainha', 'Peniche', 'Nazaré', 'Alcobaça']);
  caixas('Ribatejo',
    ['Azambuja', 'Cartaxo', 'Santarém', 'Almeirim', 'Alpiarça', 'Benavente', 'Salvaterra de Magos', 'Coruche',
     'Rio Maior', 'Vila Nova da Barquinha', 'Entroncamento', 'Torres Novas', 'Tomar']);
  caixas('Outras regiões', ['Algarve', 'Alentejo', 'Aveiro', 'Porto'], true);

  // 3. Zonas prioritárias
  seccao('3. Zonas prioritárias', 'Das localidades selecionadas, indique as 3 zonas prioritárias de investimento.');
  form.addTextItem().setTitle('1.ª zona prioritária');
  form.addTextItem().setTitle('2.ª zona prioritária');
  form.addTextItem().setTitle('3.ª zona prioritária');

  // 4. Tipo de imóvel
  seccao('4. Tipo de imóvel');
  caixas('Apartamentos',
    ['Cave com luz natural e logradouro', 'Rés do chão', '1.º andar sem elevador', '2.º andar sem elevador',
     '3.º andar sem elevador', '4.º andar sem elevador', '5.º andar ou acima sem elevador', 'Com elevador']);
  caixas('Outros tipos de imóvel', ['Moradias', 'Terrenos', 'Imóveis comerciais', 'Prédios', 'Ruínas'], true);

  // 5. Tipologia
  caixas('5. Tipologia', ['T0', 'T1', 'T2', 'T3', 'T4', 'T5 ou superior'], true);

  // 6. Tipo de oportunidade
  seccao('6. Tipo de oportunidade imobiliária');
  caixas('Que tipo de oportunidade lhe interessa?',
    ['Imóveis para remodelar e revender', 'Imóveis para revenda sem remodelar', 'Imóveis novos',
     'Imóveis para arrendamento / Alojamento Local', 'Imóveis em planta', 'Imóveis em vendas judiciais'],
    true, 'Opções apresentadas por ordem de relevância.');

  // 7. Obras
  seccao('7. Nível de obras aceite');
  caixas('Que nível de obras aceita no investimento?',
    ['Sem obras (pronto a habitar)', 'Obras ligeiras (pintura, pavimentos)', 'Obras médias (cozinha, casas de banho)',
     'Remodelação total', 'Reconstrução / reabilitação profunda'], true);
  form.addTextItem().setTitle('Valor de remodelação aceite por m² (€/m²)')
    .setValidation(FormApp.createTextValidation().requireNumberGreaterThanOrEqualTo(0)
      .setHelpText('Indique apenas o número, em euros por m².').build());

  // 8. Capital
  seccao('8. Capital e financiamento');
  escolhaUnica('Capital disponível para investir em imobiliário',
    ['Até 100.000 €', '100.000 € – 250.000 €', '250.000 € – 500.000 €', '500.000 € – 1.000.000 €', 'Acima de 1.000.000 €']);
  caixas('Forma de financiamento', ['Capital próprio', 'Crédito bancário', 'Misto']);

  // 9. Tempo de investimento
  caixas('9. Tempo de investimento',
    ['Curto prazo (até 12 meses)', 'Médio prazo (1 a 3 anos)', 'Longo prazo (mais de 3 anos)']);

  // 10. ROI
  escolhaUnica('10. Expectativa de rentabilidade anual (ROI) estimada',
    ['Até 5%', '5% – 10%', '10% – 15%', '15% – 20%', 'Acima de 20%'], true);

  // 11. Observações e RGPD
  seccao('11. Observações e consentimento');
  form.addParagraphTextItem().setTitle('Observações');
  form.addCheckboxItem().setTitle('Consentimento RGPD')
    .setChoiceValues(['Autorizo a Semedo & Corrêa a tratar os dados pessoais aqui fornecidos para efeitos de ' +
      'contacto e apresentação de oportunidades de investimento imobiliário, nos termos do Regulamento Geral ' +
      'sobre a Proteção de Dados (RGPD).'])
    .setRequired(true);

  // Folha de respostas
  var folha = SpreadsheetApp.create('Respostas – Perfil de Investidor Semedo & Corrêa');
  form.setDestination(FormApp.DestinationType.SPREADSHEET, folha.getId());

  Logger.log('Link para enviar aos investidores: ' + form.getPublishedUrl());
  Logger.log('Editar o formulário: ' + form.getEditUrl());
  Logger.log('Folha de respostas: ' + folha.getUrl());
}
