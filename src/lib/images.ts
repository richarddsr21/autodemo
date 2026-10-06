/**
 * Redimensiona uma imagem no navegador antes de a guardar:
 * no máximo `maxWidth` px de largura, convertida para JPEG.
 */
export async function resizeImage(file: File, maxWidth = 1600, quality = 0.8): Promise<string> {
  if (!file.type.startsWith("image/")) throw new Error(`"${file.name}" não é uma imagem.`);

  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  } catch {
    throw new Error(`Não foi possível ler "${file.name}". Use fotografias JPG, PNG ou WebP.`);
  }

  const escala = Math.min(1, maxWidth / bitmap.width);
  const largura = Math.round(bitmap.width * escala);
  const altura = Math.round(bitmap.height * escala);

  const canvas = document.createElement("canvas");
  canvas.width = largura;
  canvas.height = altura;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("O navegador não permitiu processar a imagem.");
  ctx.fillStyle = "#FFFFFF"; // fundo branco para PNG com transparência
  ctx.fillRect(0, 0, largura, altura);
  ctx.drawImage(bitmap, 0, 0, largura, altura);
  bitmap.close();

  return canvas.toDataURL("image/jpeg", quality);
}
