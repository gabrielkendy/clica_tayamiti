-- Criar buckets de storage
-- Executar no SQL Editor do Supabase

INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('audios', 'audios', false),
  ('documentos', 'documentos', false),
  ('fotos', 'fotos', true)
ON CONFLICT (id) DO NOTHING;

-- Políticas de acesso para audios (privado)
CREATE POLICY "Acesso audios" ON storage.objects
FOR ALL USING (bucket_id = 'audios');

-- Políticas de acesso para documentos (privado)
CREATE POLICY "Acesso documentos" ON storage.objects
FOR ALL USING (bucket_id = 'documentos');

-- Políticas de acesso para fotos (público)
CREATE POLICY "Acesso fotos" ON storage.objects
FOR ALL USING (bucket_id = 'fotos');
