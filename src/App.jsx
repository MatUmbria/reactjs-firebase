import { db, auth } from "./firebaseConnection"
import './app.css';
import { useEffect, useState } from "react";
import { 
  doc, 
  setDoc, 
  collection, 
  addDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  onSnapshot 
} from "firebase/firestore";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from "firebase/auth";


function App() {
  const [titulo, setTitulo] = useState('');
  const [autor, setAutor] = useState('');
  const [idPost, setIdPost] = useState('');

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const [user, setUser] = useState(false);
  const [userDetail, setUserDetail] = useState({});

  const [posts, setPosts] = useState([]);



  useEffect(() => {
    async function loadPosts() {
      const unsub = onSnapshot(collection(db, "posts"), (snapshot) => {
        let listaPost = [];

      snapshot.forEach((doc) => {
        listaPost.push({
          id: doc.id,
          titulo: doc.data().titulo,
          autor: doc.data().autor,
        })
      })


      setPosts(listaPost)
      })
    }

    loadPosts()
  }, [])

  useEffect(() => {
    async function checkLogin(){
      onAuthStateChanged(auth, (user) => {
        if (user) {
          //se tem usuário logado...
          console.log(user)
          setUser(true)
          setUserDetail({
            uid: user.uid,
            email: user.email,
          })
        } else {
          //se não tem usuário logado...
          setUser(false);
          setUserDetail({});
        }
      })
    }

    checkLogin();
  }, [])

  async function handleAdd(){

    await addDoc(collection(db, "posts"), {
      titulo: titulo,
      autor: autor,
    })
    .then(() => {
      console.log("Dados cadastrados no banco!")
      setAutor('')
      setTitulo('')
    })
    .catch((error) => {
      console.log("Gerou Erro!" + error)
    })
  }

  async function buscarPost(){

    const postRef = collection(db, "posts")
    await getDocs(postRef)
    .then((snapshot) => {
      let lista = [];

      snapshot.forEach((doc) => {
        lista.push({
          id: doc.id,
          titulo: doc.data().titulo,
          autor: doc.data().autor,
        })
      })

      setPosts(lista);

    })
    .catch((error) => {
        console.log("Gerou Erro!" + error)
      })
  }

  async function editarPost(){
    const docRef = doc(db, "posts", idPost)
    await updateDoc(docRef, {
      titulo: titulo,
      autor: autor
    })
    .then(() => {
      console.log("Post atualizado")
      setIdPost('')
      setTitulo('')
      setAutor('')
    })
    .catch((error) => {
      console.log("Gerou Erro!" + error)
    })
  }

  async function excluirPost(id) {
    const docRef = doc(db, "posts", id)
    await deleteDoc(docRef)
    .then(() => {
      alert("Post deletado")
    })
    .catch((error) => {
      console.log("Gerou Erro!" + error)
    })
  }

  async function novoUsuario() {
    await createUserWithEmailAndPassword(auth, email, senha)
    .then(() => {
      alert("Cadastrado com sucesso!")
      setEmail('')
      setSenha('')
    })
    .catch((error) => {
      if(error.code === 'auth/weak-password'){
        alert("Senha muito fraca!")
      }else if(error.code === 'auth/email-already-in-use'){
        alert("Email já cadastrado!")
      }
    })
  }

  async function logarUsuario(){
    await signInWithEmailAndPassword(auth, email, senha)
    .then((value) => {
      console.log("Logado com sucesso!")
      console.log(value.user)

      setUserDetail({
        uid: value.user.uid,
        email: value.user.email,
      })
      setUser(true)

      setEmail('')
      setSenha('')
    })
    .catch((error) => {
      console.log("Gerou Erro!" + error)
    })
  }

  async function fazerLogout (){
    await signOut(auth)
    setUser(false)
    setUserDetail({})
  }

  return (
    <div>
      <h1>React + Firebase</h1>

      { user && (
        <div>
          <strong>Seja bem vindo(a) (Você está logado)</strong> <br />
          <span>Id: {userDetail.uid} - Email: {userDetail.email}</span> <br />
          <button onClick={fazerLogout}>Sair</button>
          <br /><br />
        </div>
      )}

      <div className="container">
        <h2>Usuários</h2>
        <label>Email:</label>
        <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Digite seu email"
        />

        <br />

        <label>Senha:</label>
        <input
        type="password"
        value={senha}
        onChange={(e) => setSenha(e.target.value)}
        placeholder="Digite sua senha"
        />

        <button onClick={novoUsuario}>Cadastrar</button>
        <button onClick={logarUsuario}>Login</button>
      </div>

      <br /><br />
      <hr />

    <div className="container">
      <h2>Posts</h2>

      <label>ID dos Post:</label>
      <input placeholder="Digite o ID do post"
      value={idPost}
      onChange={(e) => setIdPost(e.target.value)} 
      /> <br />

      <label>Título:</label>
      <textarea 
        type="text"
        placeholder="Digite o título"
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
      />

      <label>Autor:</label>
      <textarea 
        type="text"
        placeholder="Autor do post"
        value={autor}
        onChange={(e) => setAutor(e.target.value)}
      />

      <button onClick={handleAdd}>Cadastrar</button>
      <button onClick={editarPost}>Atualizar post</button>
      <button onClick={buscarPost}>Buscar Posts</button>

      <ul>
        {posts.map((post) => {
          return(
            <li key={post.id}>
              <strong>ID: {post.id}</strong> <br />
              <span>Título: {post.titulo}</span> <br />
              <span>Autor: {post.autor}</span> <br />
              <button onClick={() => excluirPost(post.id)}>Excluir</button> <br /><br />
            </li>
          )
        })}
      </ul>

    </div>
    </div>
  )
}

export default App
