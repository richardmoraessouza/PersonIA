import axios from "axios";
import { API_URL } from "../config/api";

export async function buscarPersonagensUsuario(usuarioId: number, token: string) {
  const res = await axios.get(`${API_URL}/buscarPerson/${usuarioId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  return Array.isArray(res.data)
    ? res.data
    : res.data.personagens || [];
}

export async function buscarPersonagens() {
  const res = await axios.get(`${API_URL}/personagens`);
  return Array.isArray(res.data) ? res.data : res.data.personagens || [];
}

export async function buscarNomeCriador(usuarioId?: number | null, token?: string | null) {
  try {
    if (!usuarioId) return 'IA';
    const res = await axios.get(`${API_URL}/nomeCriador/${usuarioId}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined
    });

    return (res && res.data && (res.data.nome || res.data.name)) ? (res.data.nome || res.data.name) : 'IA';
  } catch (err) {
    console.warn('Erro ao buscar nome do criador', err);
    return 'IA';
  }
}

export async function buscarLikesUsuario(usuarioId: number, token: string) {
  const res = await axios.get(`${API_URL}/likesByUsuario/${usuarioId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  return Array.isArray(res.data)
    ? res.data.map((id: any) => Number(id))
    : [];
}

export async function buscarFavoritosUsuario(usuarioId: number, token: string) {
  const res = await axios.get(`${API_URL}/getFavoritosFull/${usuarioId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  return Array.isArray(res.data)
    ? res.data.map((item: any) => Number(item.id))
    : [];
}

export async function buscarQuantidadeLikes(personagemId: number) {
  const res = await axios.get(`${API_URL}/likesQuantidade/${personagemId}`);
  return res.data.total || res.data.likes || 0;
}

export async function toggleLike(usuarioId: number, personagemId: number, token: string) {
  const res = await axios.post(
    `${API_URL}/toggleLike/${usuarioId}/${personagemId}`,
    null,
    { headers: { Authorization: `Bearer ${token}` } }
  );

  return res.data;
}

export async function toggleFavorito(usuarioId: number, personagemId: number, token: string) {
  const res = await axios.post(
    `${API_URL}/favoritos/${usuarioId}/${personagemId}`,
    null,
    { headers: { Authorization: `Bearer ${token}` } }
  );

  return res.data;
}
