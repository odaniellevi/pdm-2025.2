import React, { useEffect, useState } from 'react'
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal } from 'react-native'
import Svg, { Line, Circle } from 'react-native-svg'

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

    function renderWord() {
        return (
            <View style={styles.wordRow}>
                {word.split('').map((ch, idx) => (
                    <View key={idx} style={styles.letterBox}>
                        <Text style={styles.letterText}>{revealed[idx] || status === 'lost' || status === 'won' ? ch : '_'}</Text>
                    </View>
                ))}
            </View>
        )
    }

    function renderKeyboard() {
        return (
            <View style={styles.keyboard}>
                {ALPHABET.map((l) => {
                    const disabled = guessed.includes(l) || status !== 'playing'
                    const isCorrect = guessed.includes(l) && word.includes(l)
                    const isWrong = guessed.includes(l) && !word.includes(l)
                    return (
                        <TouchableOpacity key={l} style={[styles.key, disabled && styles.keyDisabled, isCorrect && styles.keyCorrect, isWrong && styles.keyWrong]} onPress={() => onGuess(l)} disabled={disabled}>
                            <Text style={styles.keyText}>{l}</Text>
                        </TouchableOpacity>
                    )
                })}
            </View>
        )
    }

    function renderTriedLetters() {
        return (
            <View style={styles.triedRow}>
                <Text style={styles.trimTitle}>Letras tentadas:</Text>
                <View style={styles.triedList}>
                    {guessed.length === 0 ? <Text style={styles.noneText}>Nenhuma ainda</Text> : guessed.map((l) => (
                        <Text key={l} style={[styles.triedItem, word.includes(l) ? styles.triedCorrect : styles.triedWrong]}>{l}</Text>
                    ))}
                </View>
            </View>
        )
    }

    function renderHangman() {
        return (
            <Svg height="220" width="150" viewBox="0 0 150 220">
                {/* Estrutura da forca */}
                <Line x1="10" y1="200" x2="140" y2="200" stroke="#333" strokeWidth="4" />
                <Line x1="40" y1="200" x2="40" y2="20" stroke="#333" strokeWidth="4" />
                <Line x1="40" y1="20" x2="100" y2="20" stroke="#333" strokeWidth="4" />
                <Line x1="100" y1="20" x2="100" y2="40" stroke="#333" strokeWidth="4" />


                {/* Partes do boneco progressivamente */}
                {wrongCount > 0 && <Circle cx="100" cy="60" r="15" stroke="#333" strokeWidth="3" fill="none" />}
                {wrongCount > 1 && <Line x1="100" y1="75" x2="100" y2="120" stroke="#333" strokeWidth="3" />}
                {wrongCount > 2 && <Line x1="100" y1="85" x2="80" y2="105" stroke="#333" strokeWidth="3" />}
                {wrongCount > 3 && <Line x1="100" y1="85" x2="120" y2="105" stroke="#333" strokeWidth="3" />}
                {wrongCount > 4 && <Line x1="100" y1="120" x2="80" y2="155" stroke="#333" strokeWidth="3" />}
                {wrongCount > 5 && <Line x1="100" y1="120" x2="120" y2="155" stroke="#333" strokeWidth="3" />}
            </Svg>
        )
    }
