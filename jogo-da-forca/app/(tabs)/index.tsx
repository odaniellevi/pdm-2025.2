import { useEffect, useState } from "react"

const WORDS = [
'REACT', 'NATIVE', 'EXPO', 'JAVASCRIPT', 'COMPONENT', 'ESTADO', 'PROPS', 'FUNCIONAL', 'ANDROID', 'IOS',
'MOBILE', 'DESIGN', 'HOOKS', 'ASYNC', 'PROMISE', 'ARRAY', 'OBJETO', 'VARIAVEL', 'FUNCAO', 'SIMULADOR',
'REINICIAR', 'VITORIA', 'DERROTA', 'TENTATIVAS', 'TECLADO', 'INTERFACE', 'SVG', 'ESTILOS', 'LAYOUT', 'USUARIO',
'PORTUGUES', 'BRASIL', 'PERNAMBUCO', 'PORTO', 'DIGITAL', 'GITHUB'
]

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

export default function App() {
const [word, setWord] = useState('')
const [revealed, setRevealed] = useState([])
const [guessed, setGuessed] = useState([])
const [wrongCount, setWrongCount] = useState(0)
const [maxWrong] = useState(6)
const [status, setStatus] = useState('playing')