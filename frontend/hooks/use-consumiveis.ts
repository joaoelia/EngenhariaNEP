import { useState, useEffect } from "react";

interface Consumivel {
  id: number;
  nome: string;
  partNumber: string;
  quantidade: number;
  fornecedor: string;
  localEstoque: string;
}

export function useConsumiveis() {
  const [consumiveis, setConsumiveis] = useState<Consumivel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch dados
  const fetchConsumiveis = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("jwt_token");

      const response = await fetch("http://localhost:8080/api/consumiveis", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Erro ao carregar consumíveis");
      }

      const data = await response.json();
      setConsumiveis(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  };

  // Criar novo consumível
  const criarConsumivel = async (consumivel: Omit<Consumivel, "id">) => {
    try {
      const token = localStorage.getItem("jwt_token");

      const response = await fetch("http://localhost:8080/api/consumiveis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nome: consumivel.nome,
          part_number: consumivel.partNumber,
          quantidade: consumivel.quantidade,
          fornecedor: consumivel.fornecedor,
          local_estoque: consumivel.localEstoque,
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao criar consumível");
      }

      const novoConsumiivel = await response.json();
      setConsumiveis([...consumiveis, novoConsumiivel]);
      return novoConsumiivel;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro desconhecido";
      setError(message);
      throw err;
    }
  };

  // Atualizar consumível
  const atualizarConsumiivel = async (id: number, consumivel: Omit<Consumivel, "id">) => {
    try {
      const token = localStorage.getItem("jwt_token");

      const response = await fetch(`http://localhost:8080/api/consumiveis/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nome: consumivel.nome,
          part_number: consumivel.partNumber,
          quantidade: consumivel.quantidade,
          fornecedor: consumivel.fornecedor,
          local_estoque: consumivel.localEstoque,
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao atualizar consumível");
      }

      const updated = await response.json();
      setConsumiveis(consumiveis.map((c) => (c.id === id ? updated : c)));
      return updated;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro desconhecido";
      setError(message);
      throw err;
    }
  };

  // Deletar consumível
  const deletarConsumiivel = async (id: number) => {
    try {
      const token = localStorage.getItem("jwt_token");

      const response = await fetch(`http://localhost:8080/api/consumiveis/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Erro ao deletar consumível");
      }

      setConsumiveis(consumiveis.filter((c) => c.id !== id));
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro desconhecido";
      setError(message);
      throw err;
    }
  };

  useEffect(() => {
    fetchConsumiveis();
  }, []);

  return {
    consumiveis,
    loading,
    error,
    fetchConsumiveis,
    criarConsumievel: criarConsumivel,
    atualizarConsumievel: atualizarConsumiivel,
    deletarConsumievel: deletarConsumiivel,
  };
}
