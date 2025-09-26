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

useEffect(() => startNewGame(), [])

function pickWord() {
const w = WORDS[Math.floor(Math.random() * WORDS.length)]
return w
}

function startNewGame() {
const w = pickWord()
setWord(w)
setRevealed(Array.from({ length: w.length }).map(() => false))
setGuessed([])
setWrongCount(0)
setStatus('playing')
}

function onGuess(letter) {
if (status !== 'playing') return
if (guessed.includes(letter)) return
const newGuessed = [...guessed, letter]
setGuessed(newGuessed)

if (word.includes(letter)) {
const newRevealed = revealed.slice()
for (let i = 0; i < word.length; i++) {
if (word[i] === letter) newRevealed[i] = true
}
setRevealed(newRevealed)
// Verifica se venceu
if (newRevealed.every(Boolean)) setStatus('won')
} else {
// Caso contrário, incrementa erros
const wc = wrongCount + 1
setWrongCount(wc)
if (wc >= maxWrong) setStatus('lost')
}
}