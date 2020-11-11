import React, { useState, FormEvent } from 'react';
import { useHistory } from 'react-router-dom';
import * as yup from 'yup';

import { toast } from 'react-toastify';
import Header from '../../components/Header';
import { Container, Title, Form } from './styles';
import api from '../../services/api';

const Registry: React.FC = () => {
  const [title, setTitle] = useState('');
  const [type, setType] = useState('Selecione uma opção');
  const [money, setMoney] = useState('');
  const [category, setCategory] = useState('');

  const history = useHistory();

  async function handleSubmit(event: FormEvent): Promise<void> {
    event.preventDefault();
    if (type === 'Selecione uma opção') {
      toast.error('Selecione o tipo da transação');
      return;
    }

    const data = {
      title,
      type: type === 'Ganho' ? 'income' : 'outcome',
      value: Number(money),
      category,
    };
    const schema = yup.object().shape({
      title: yup.string().required('Informe o titulo da transação'),
      type: yup.string().required('Informe o tipo da transação'),
      value: yup.number().required('Informe o valor da transação'),
      category: yup.string().required('Informe a categoria da transação'),
    });

    try {
      await schema.validate(data);
      await api.post('transactions', data);
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        error.errors.forEach(erro => toast.error(erro));
        return;
      }
      const {
        data: { message },
      } = error.response;
      toast.error(message);
      return;
    }
    toast.info('Transação cadastrada');
    history.push('/');
  }
  return (
    <>
      <Header size="small" page="cadastro" />
      <Container>
        <Title>Cadastrar uma transação</Title>
        <Form onSubmit={handleSubmit}>
          <div className="input-block">
            <label htmlFor="title">Titulo:</label>
            <input
              id="title"
              name="title"
              type="text"
              value={title}
              onChange={({ target: { value } }) => {
                setTitle(value);
              }}
            />
          </div>

          <div className="input-block">
            <label htmlFor="Tipo">Tipo:</label>

            <select
              name="select"
              id="select"
              value={type}
              onChange={({ target: { value } }) => {
                setType(value);
              }}
            >
              <option>Selecione uma opção</option>
              <option>Ganho</option>
              <option>Gasto</option>
            </select>
          </div>
          <div className="input-block">
            <label htmlFor="valor">Valor:</label>
            <input
              id="valor"
              name="valor"
              type="number"
              value={money}
              onChange={({ target: { value } }) => {
                setMoney(value);
              }}
            />
          </div>
          <div className="input-block">
            <label htmlFor="Categoria">Categoria:</label>
            <input
              id="Categoria"
              name="Categoria"
              type="text"
              value={category}
              onChange={({ target: { value } }) => {
                setCategory(value);
              }}
            />
          </div>
          <button type="submit" onClick={handleSubmit}>
            Enviar
          </button>
        </Form>
      </Container>
    </>
  );
};

export default Registry;
