import { test, expect } from '@playwright/test';
import { TrabalheConoscoPage } from '../support/pages/TrabalheConoscoPage'; 

const DADOS_SIMPLES = {
  vaga: 'BANCO DE TALENTOS', 
  nome: 'Teste Simples QA',
  email: 'simples@testes.com',
  telefone: '11900001111',
};

test.describe('Testes Simples do Formulário Trabalhe Conosco (Useall)', () => {
  let trabalheConoscoPage: TrabalheConoscoPage;

  test.beforeEach(async ({ page }) => {
    trabalheConoscoPage = new TrabalheConoscoPage(page);
    await trabalheConoscoPage.goto();
    await trabalheConoscoPage.vagaSelect.waitFor({ state: 'visible' }); 
  });

  test('Deve preencher os campos mínimos (Vaga, Nome, Email, Telefone) e submeter', async ({ page }) => {
    
    await trabalheConoscoPage.preencherFormulario(DADOS_SIMPLES);

    await trabalheConoscoPage.submeter();

    await trabalheConoscoPage.validarSubmissaoBemSucedida(page);
  });

  test('Não deve submeter sem preencher o campo E-mail', async ({ page }) => {
    
    await trabalheConoscoPage.vagaSelect.selectOption({ label: DADOS_SIMPLES.vaga });
    await trabalheConoscoPage.nomeInput.fill(DADOS_SIMPLES.nome);
    await trabalheConoscoPage.telefoneInput.fill(DADOS_SIMPLES.telefone);

    await trabalheConoscoPage.enviarButton.click({ force: true }); 
    
    await trabalheConoscoPage.validarErroDeValidacao('E-mail');

    await expect(page).toHaveURL(trabalheConoscoPage.url);
  });

  test('Deve usar ZeroStepAI para preencher todos os campos em um passo', async ({ page }) => {
    
    await test.step('ZeroStepAI: Preenchimento Completo dos Campos Visíveis', async () => {
        const pom = new TrabalheConoscoPage(page);
        
        await pom.preencherFormulario({
            vaga: 'BANCO DE TALENTOS',
            nome: 'ZeroStepAI Teste',
            email: 'ai-teste@zerostep.com',
            telefone: '22998877665',
            mensagem: 'Este é um teste automatizado pelo ZeroStepAI.',
        });
        
        await pom.submeter();
        
        await pom.validarSubmissaoBemSucedida(page);
    });
    
    await expect(page).not.toHaveURL(trabalheConoscoPage.url);
  });
});