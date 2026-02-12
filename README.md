# Inspeção Shineray (MVP)

## 1) Banco (Supabase)
- Abra o SQL Editor e cole `supabase.sql` (execute).
- Depois vá em Authentication e crie pelo menos 1 usuário (ou use a tela de signup do sistema).

## 2) Rodar local
```bash
npm i
npm run dev
```

## 3) Deploy Vercel
- Importe este projeto
- Configure variáveis:
  - NEXT_PUBLIC_SUPABASE_URL=https://yyfurzpczrhmwhpmklqv.supabase.co
  - NEXT_PUBLIC_SUPABASE_ANON_KEY=<sua anon key>
- Deploy

## Offline
A tela /inspecao salva no tablet (IndexedDB) e sincroniza na volta da internet.
