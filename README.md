# 🧠 SafeSurf AI — Chrome Extension (Gemini Nano / Gemini API)

**SafeSurf AI** é uma extensão para o Google Chrome desenvolvida para o **Google Chrome Built-in AI Challenge 2025**.  
Ela utiliza o **Gemini Nano (on-device)** e a **Gemini API (cloud)** para analisar, traduzir e revisar conteúdo da web, oferecendo uma navegação mais **segura, clara e acessível**.

---

## 💡 Visão Geral
O SafeSurf AI atua diretamente no navegador, permitindo ao usuário interagir com páginas e textos utilizando Inteligência Artificial de forma rápida e integrada.  
Com o uso do **Gemini Nano**, o sistema realiza análises localmente — sem depender de conexão constante — e, quando necessário, recorre ao **Gemini Cloud** de forma automática.

---

## 🚀 Funcionalidades
- **Analyze Page (Analisar Página):**  
  Gera um resumo inteligente da aba atual, identifica os principais tópicos e avalia o nível de risco (segurança, confiabilidade, links suspeitos etc.).  
  🆕 **Atualização:** agora o botão **Analyze Page** sempre analisa a aba ativa, independentemente da opção selecionada no menu.

- **Translate (Traduzir):**  
  Traduz textos diretamente no popup, com suporte a múltiplos idiomas.

- **Rewrite (Reescrever):**  
  Reformula textos automaticamente, tornando-os mais claros, concisos e com melhor fluidez.  
  (Função corrigida — agora responde corretamente via fallback de modelo em caso de sobrecarga do servidor).

- **Proofread (Revisar):**  
  Faz revisão gramatical e ortográfica, corrigindo pontuação e erros de digitação.

- **Fallback inteligente:**  
  Se o Gemini Nano não estiver disponível, a extensão utiliza automaticamente a Gemini API Cloud.

---

## ⚙️ Tecnologias Utilizadas
- **Manifest V3** — Estrutura moderna para extensões Chrome  
- **JavaScript (ES Modules)** — Código modular e assíncrono  
- **Gemini Nano + Gemini API** — IA embarcada e em nuvem  
- **Chrome Storage & Messaging API** — Persistência e comunicação interna  
- **HTML/CSS minimalista** — Interface leve e acessível  

---

## 🔒 Privacidade
Nenhum dado é armazenado localmente ou enviado a terceiros sem consentimento.  
O modo **cloud** só é ativado quando o usuário habilita explicitamente a opção “Enable Cloud Fallback” nas configurações.

---

## 🧰 Instalação
1. Baixe o repositório (`Code > Download ZIP`)  
2. No Chrome, acesse: `chrome://extensions`  
3. Ative o **Modo desenvolvedor**  
4. Clique em **Carregar sem compactação**  
5. Selecione a pasta `SafeSurfAI`  
6. O ícone da extensão aparecerá na barra de ferramentas do Chrome  

---

## 🧪 Como Usar
1. Abra uma página comum (ex.: Wikipedia)  
2. Clique no ícone do **SafeSurf AI**  
3. Selecione uma função ou clique em **Analyze Page** para analisar a aba ativa  
4. Veja o resumo, nível de risco, entidades e sugestões diretamente no popup  

---

## 👤 Autor
**Matheus Amorim de Souza**  
Técnico em Segurança do Trabalho e Desenvolvedor  
💼 [GitHub](https://github.com/Matheus0805amorim) | 🔗 [LinkedIn](https://www.linkedin.com/in/matheus0805amorim)

---

## 🏆 Hackathon
Este projeto foi desenvolvido como parte do **Google Chrome Built-in AI Challenge 2025 — Innovate with Intelligence**, promovido pela Devpost e Google.  
O SafeSurf AI demonstra o potencial das **IAs embarcadas (Gemini Nano)** para criar experiências web mais seguras, inteligentes e autônomas.



