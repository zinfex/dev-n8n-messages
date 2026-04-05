import { Link, useNavigate } from "react-router-dom";
import { clearToken, getToken } from "../utils/auth";
import React from "react";
import { LuMessageSquarePlus } from "react-icons/lu";
import { BiMessageSquareDetail } from "react-icons/bi";
import { MdLogout } from "react-icons/md";

export default function Layout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const token = getToken();
  return (
    <div className="layout-container">
      <header className="layout-header">
        <nav className="layout-nav">
          <Link to="/messages">
            <BiMessageSquareDetail size={20} /> Mensagens
          </Link>
          <Link to="/messages/new">
            <LuMessageSquarePlus size={20} /> Nova
          </Link>
        </nav>
        <div>
          {token ? (
            <button
              onClick={() => {
                clearToken();
                navigate("/login");
              }}
              aria-label="Sair"
            >
              <MdLogout size={17} /> Sair
            </button>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </div>
      </header>
      <main className="layout-main">{children}</main>
    </div>
  );
}
