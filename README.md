# 🏛️ Participa DF – Ouvidoria Cidadã

Protótipo funcional desenvolvido para o **1º Hackathon em Controle Social – Desafio Participa DF**, com o objetivo de simplificar e ampliar a participação cidadã na Ouvidoria do Governo do Distrito Federal.

O projeto propõe uma experiência digital **simples, acessível e inclusiva**, permitindo que qualquer cidadão registre uma manifestação de forma rápida e segura, inclusive usuários com baixa familiaridade digital.

---

## 🎯 Objetivo

Facilitar o registro de:

* Reclamações
* Denúncias
* Sugestões
* Elogios

Por meio de uma aplicação:

* 📱 Mobile-first
* ♿ Acessível (WCAG 2.1 AA)
* 🎤 Multicanal (texto, áudio, imagem e vídeo)
* 🔐 Com anonimato opcional
* 📄 Com geração automática de protocolo

---

## ✨ Funcionalidades

### 🎤 Modo Rápido por Voz

Permite que o cidadão apenas fale sua manifestação.
O sistema realiza a transcrição automática, sugere o assunto com base em palavras-chave e gera o protocolo.

### 🗂️ Triagem por Assunto

O cidadão escolhe o problema, não o órgão.
O sistema sugere automaticamente o encaminhamento adequado.

### 📎 Multicanalidade

Envio por:

* Texto
* Áudio
* Imagem
* Vídeo

### 📄 Geração de Protocolo

Cada manifestação gera um número único no formato:

```
DF-YYYYMMDD-XXXXXX
```

### 📊 Painel de Protocolos (Demonstração)

Página pública demonstrativa que exibe:

* Protocolo
* Assunto
* Órgão sugerido
* Canal utilizado
* Data do registro

Não exibe dados pessoais.

---

## ♿ Acessibilidade (WCAG 2.1 AA)

O projeto implementa:

* Contraste adequado de cores
* Navegação completa por teclado
* Foco visível em elementos interativos
* Labels e aria-labels apropriados
* Mensagens com aria-live
* Linguagem simples e orientativa

---

## 🔐 Privacidade

* Anonimato opcional
* Não exibição de dados pessoais no painel
* Projeto demonstrativo, sem armazenamento persistente real

---

## 🧱 Tecnologias Utilizadas

* Next.js
* TypeScript
* Tailwind CSS
* Progressive Web App (PWA)
* APIs nativas do navegador (MediaRecorder, Speech Recognition quando disponível)

---

## ▶️ Como rodar o projeto

```bash
npm install
npm run dev
```

A aplicação estará disponível em:

```
http://localhost:3000
```

---

## 🧠 Arquitetura

* Interface (Front-end)
* Camada de serviços para envio (mock)
* Geração automática de protocolo
* Classificação por palavras-chave
* Persistência local para demonstração

Preparado para futura integração com o Participa DF e sistemas internos.

---

## 🤖 Uso de Inteligência Artificial

Foram utilizadas ferramentas de apoio ao desenvolvimento, incluindo geração assistida de código, com foco na aceleração da prototipação.

As decisões de UX, fluxos, regras de triagem e arquitetura foram definidas pelos autores do projeto.

---

## ⚠️ Observações

Este projeto é um **protótipo funcional**, desenvolvido exclusivamente para fins de demonstração no hackathon.
Não representa ambiente de produção.

---

## 🎬 Demonstração

Link do vídeo demonstrativo:
(https://drive.google.com/file/d/13EfqWRw0FhWzgZ_Jtp7yAvd0Xgo6wTnB/view?usp=drive_link)

