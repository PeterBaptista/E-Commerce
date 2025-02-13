import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import type { Database } from "./database.types";

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

if (!supabaseUrl || !supabaseKey) {
	throw new Error("Missing Supabase URL or API key");
}

async function getRecentOrders(userId: string) {
  try {
    const { data, error } = await supabase
      .from('order-history') // Nome da tabela
      .select('*') // Seleciona todas as colunas
      .eq('user_id', userId) // Filtra pelo ID do usuário
      .order('created_at', { ascending: false }) // Ordena por created_at em ordem decrescente
      .limit(3); // Limita a 3 registros

    if (error) {
      throw new Error(`Erro ao consultar pedidos: ${error.message}`);
    }

    return data; // Retorna os pedidos
  } catch (err) {
    console.error(err);
    throw err;
  }
}

const supabase = createClient<Database>(supabaseUrl, supabaseKey);

export default supabase;
