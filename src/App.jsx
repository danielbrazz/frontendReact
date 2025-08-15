import { useEffect, useState } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import Sobre from './sobre';


export default function App() {
  const [produtos, setProdutos] = useState([]);
  const [form, setForm] = useState({ nome: '', valor: '', quantidade: '' });
  const [editId, setEditId] = useState(null);

  const api = 'http://127.0.0.1:8000/produto/produtos';
  useEffect(() => {
    listarProdutos();
  }, []);

  const listarProdutos = () => {

    axios.get(api).then(res => setProdutos(res.data));
  };

  const salvarProduto = () => {
    if (!form.nome || !form.valor || !form.quantidade) {
      alert("Preencha todos os campos!");
      return;
    }

    if (editId) {
      axios.put(`${api}/${editId}`, form).then(() => {
        console.log(api);
        listarProdutos();
        setForm({ nome: '', valor: '', quantidade: '' });
        setEditId(null);
      });
    } else {
      axios.post(api, form).then(() => {
        listarProdutos();
        setForm({ nome: '', valor: '', quantidade: '' });
      });
    }
  };

  const editarProduto = (produto) => {
    setForm({ nome: produto.nome, valor: produto.valor, quantidade: produto.quantidade });
    setEditId(produto.id);
  };

  const excluirProduto = (id) => {
    if (window.confirm("Tem certeza que deseja excluir este produto?")) {
      axios.delete(`${api}/${id}`).then(listarProdutos);
    }
  };

  return (
    <Router>
      <nav>
        <Link to="/">Home</Link> | <Link to="/sobre">Sobre</Link>
      </nav>
      <Routes>
        
        <Route path="/sobre" element={<Sobre />} />
      </Routes>



      <div className="container mt-5">
        <h1 className="mb-4 text-center">Cadastro de Produtos</h1>

        <div className="card p-4 mb-4 shadow-sm">
          <h5>{editId ? "Editar Produto" : "Novo Produto"}</h5>
          <div className="row g-3">
            <div className="col-md-4">
              <input className="form-control" placeholder="Nome" value={form.nome}
                onChange={e => setForm({ ...form, nome: e.target.value })} />
            </div>
            <div className="col-md-3">
              <input className="form-control" type="number" placeholder="Valor" value={form.valor}
                onChange={e => setForm({ ...form, valor: e.target.value })} />
            </div>
            <div className="col-md-3">
              <input className="form-control" type="number" placeholder="Quantidade" value={form.quantidade}
                onChange={e => setForm({ ...form, quantidade: e.target.value })} />
            </div>
            <div className="col-md-2">
              <button className={`btn ${editId ? 'btn-warning' : 'btn-primary'} w-100`} onClick={salvarProduto}>
                {editId ? "Atualizar" : "Cadastrar"}
              </button>
            </div>
          </div>
        </div>

        <table className="table table-hover shadow-sm">
          <thead className="table-dark">
            <tr>
              <th>Nome</th>
              <th>Valor</th>
              <th>Quantidade</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {produtos.length > 0 ? (
              produtos.map(p => (
                <tr key={p.id}>
                  <td>{p.nome}</td>
                  <td>R$ {parseFloat(p.valor).toFixed(2)}</td>
                  <td>{p.quantidade}</td>
                  <td>
                    <button className="btn btn-sm btn-warning me-2" onClick={() => editarProduto(p)}>Editar</button>
                    <button className="btn btn-sm btn-danger" onClick={() => excluirProduto(p.id)}>Excluir</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center">Nenhum produto cadastrado</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Router>
  );
}


