# 🚀 EduFlow WhatsApp — Lovable + PWA + APK Multi-Tenant

Este repositório contém o projeto completo estruturado para hospedagem e publicação no **Lovable.dev**, com suporte a **Multi-Usuários (Supabase Auth & RLS)**, **Importação de Contatos CSV**, **Gestão de Disparos WhatsApp com QR Code individual** e **Build de APK Android via CapacitorJS**.

---

## 📁 Estrutura do Projeto

```
whatsapp_lovable_app/
├── index.html               # Aplicação Web/Mobile Responsiva (Protótipo Lovable + PWA)
├── capacitor.config.json    # Configuração para Build de APK Android com Capacitor
├── supabase_schema.sql      # Schema do Banco PostgreSQL + Politicas RLS por Usuário
└── README.md                # Instruções de Integração e Deploy
```

---

## 🔑 Como Conectar ao Supabase no Lovable

1. No painel do **Lovable.dev**, habilite a integração do **Supabase**.
2. No Editor SQL do Supabase, execute o código contido em `supabase_schema.sql`.
3. O Supabase cuidará da autenticação (Login / Cadastro) e garantirá o isolamento seguro dos dados de cada usuário através de *Row Level Security (RLS)*.

---

## 📱 Como Gerar o APK Android com Capacitor

1. Instale o Capacitor no seu ambiente Node.js:
   ```bash
   npm install @capacitor/core @capacitor/cli @capacitor/android
   npx cap init "EduFlow WhatsApp" "com.eduflow.whatsapp"
   ```

2. Adicione a plataforma Android e sincronize os arquivos da web:
   ```bash
   npx cap add android
   npx cap copy
   npx cap open android
   ```

3. No **Android Studio**, clique em **Build > Build Bundle(s) / APK(s) > Build APK(s)** para gerar o arquivo `.apk`.

---

## 🌐 Recursos Integrados
* 🔑 **Autenticação Multi-Tenant**: Tela de Login/Cadastro por email/senha.
* 👥 **Gestão Nominal de Contatos**: Upload de arquivos CSV/Excel do celular ou computador + cadastro manual.
* 📱 **QR Code WhatsApp por Usuário**: Tela de conexão de WhatsApp individual.
* ✉️ **Disparador & Agendador**: Envio de mensagens com anexos do dispositivo e suporte a modelos rápidos editáveis.
* 📱 **Layout Mobile-First**: Bottom Navigation Bar nativa para navegação fluida em smartphones.
