import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useMessages, useDeleteMessage } from "../api/hooks";
import Loader from "../components/Loader";
import ErrorAlert from "../components/ErrorAlert";
import type { ProblemDetails } from "../types/problem";
import { useState } from "react";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { Pagination } from "../components/Pagination";
import { BiPlus, BiEdit, BiTrash } from "react-icons/bi";

export default function MessagesListPage() {
  const [sp, setSp] = useSearchParams({ page: "1", limit: "10" });
  const page = Number(sp.get("page") || 1);
  const limit = Number(sp.get("limit") || 10);
  const status = sp.get("status") || undefined;
  const nav = useNavigate();

  const { data, isLoading, error } = useMessages({ page, limit, status });
  const del = useDeleteMessage();
  const [toDelete, setToDelete] = useState<string | null>(null);

  function onPage(p: number) {
    sp.set("page", String(p));
    setSp(sp, { replace: true });
  }
  const resp: any = data as any;
  const items: any[] = Array.isArray(resp)
    ? resp
    : Array.isArray(resp?.data)
      ? resp.data
      : Array.isArray(resp?.items)
        ? resp.items
        : Array.isArray(resp?.results)
          ? resp.results
          : [];
  console.log(items);

  if (isLoading) return <Loader />;

  return (
    <div className="messages-container fade-in">
      <div className="header">
        <h2>Mensagens</h2>
      </div>

      <div className="filter">
        <label>Status:</label>
        <select
          value={status || ""}
          onChange={(e) => {
            const v = e.target.value;
            v ? sp.set("status", v) : sp.delete("status");
            setSp(sp, { replace: true });
          }}
        >
          <option value="">Todos</option>
          <option value="draft">Rascunho</option>
          <option value="published">Publicado</option>
        </select>
      </div>

      <ErrorAlert problem={(error || del.error) as ProblemDetails | null} />

      <div className="chat-list">
        {items.length === 0 ? (
          <div style={{ textAlign: "center", padding: "2rem", color: "#666" }}>
            Nenhuma mensagem cadastrada
          </div>
        ) : (
          items.map((m, index) => (
            <div key={m.id} className="chat-item slide-up" style={{ animationDelay: `${index * 0.05}s` }}>
              <Link to={`/messages/${m.id}`} className="chat-info">
                <div className="chat-header">
                  <span className="chat-title">{m.title}</span>
                  <span className="chat-time">
                    {new Date(m.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="chat-preview">
                  <span className={`status-badge status-${m.status}`}>
                    {m.status === 'published' ? 'Publicado' : 'Rascunho'}
                  </span>
                  {' • '}
                </div>
              </Link>
              <div className="actions" style={{ marginLeft: '12px', display: 'flex', gap: '8px' }}>
                <button
                  className="btn-edit"
                  onClick={(e) => { e.preventDefault(); nav(`/messages/${m.id}/edit`); }}
                >
                  <BiEdit />
                </button>
                <button
                  className="btn-delete"
                  onClick={(e) => { e.preventDefault(); setToDelete(m.id); }}
                >
                  <BiTrash />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {(() => {
        const meta: any = (resp && (resp.meta || resp.pagination)) || null;
        return meta ? (
          <Pagination
            page={meta.page}
            limit={meta.limit}
            total={meta.total}
            onPage={onPage}
          />
        ) : null;
      })()}

      <button
        className="fab"
        onClick={() => nav("/messages/new")}
        title="Nova Mensagem"
      >
        <BiPlus />
      </button>

      <ConfirmDialog
        open={!!toDelete}
        title="Confirmar exclusão"
        description="Tem certeza que deseja excluir esta mensagem?"
        onConfirm={async () => {
          if (toDelete) {
            await del.mutateAsync(toDelete);
            setToDelete(null);
          }
        }}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
}
