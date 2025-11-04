import { Page, expect, Locator } from '@playwright/test';

export class TrabalheConoscoPage {
  readonly page: Page;
  readonly vagaSelect: Locator;
  readonly nomeInput: Locator;
  readonly emailInput: Locator;
  readonly telefoneInput: Locator;
  readonly mensagemTextarea: Locator;
  readonly arquivoInput: Locator;
  readonly enviarButton: Locator;
  readonly url = 'https://useall.com.br/trabalhe';
  
  constructor(page: Page) {
    this.page = page;
    this.vagaSelect = page.locator('#TrabalheVacancie'); 
    this.nomeInput = page.getByPlaceholder('Nome');
    this.emailInput = page.getByPlaceholder('E-mail');
    this.telefoneInput = page.getByPlaceholder('Telefone');
    this.mensagemTextarea = page.getByPlaceholder('Mensagem (opcional)');
    this.arquivoInput = page.locator('input[type="file"]');
    this.enviarButton = page.getByRole('button', { name: 'ENVIAR' });
  }

  async goto() {
    await this.page.goto(this.url, { waitUntil: 'domcontentloaded' });
  }

  async preencherFormulario(dados: {
    vaga: string;
    nome: string;
    email: string;
    telefone: string;
    mensagem?: string; 
    caminhoArquivo?: string; 
  }) {
    await this.vagaSelect.selectOption({ label: dados.vaga });
    await this.nomeInput.fill(dados.nome);
    await this.emailInput.fill(dados.email);
    await this.telefoneInput.fill(dados.telefone);
    
    if (dados.mensagem) {
      await this.mensagemTextarea.fill(dados.mensagem);
    }
    
    if (dados.caminhoArquivo) {
        await this.arquivoInput.setInputFiles(dados.caminhoArquivo);
    }
  }

  async submeter() {
    await Promise.all([
        this.page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 15000 }), 
        this.enviarButton.click()
    ]);
  }

  async validarSubmissaoBemSucedida(page: Page) {
    const novaURL = page.url();
    expect(novaURL).not.toContain(this.url);
  }


  async validarErroDeValidacao(placeholder: string) {
    const campoComErro = this.page.getByPlaceholder(placeholder);
    
    await expect(campoComErro).toHaveClass(/.*form-error.*/); 
    
    const isRequired = await campoComErro.evaluate(el => el.hasAttribute('required'));
    if (isRequired) {
      await expect(campoComErro).toHaveJSProperty('validity', { valueMissing: true });
    }
  }
}