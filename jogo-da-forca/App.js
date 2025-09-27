import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'; 
import Svg, { Line, Circle } from 'react-native-svg';

// --- Lista de Palavras ---
const WORDS = [
  "DESENVOLVEDOR", "JAVASCRIPT", "COMPUTADOR", "TECLADO", "MONITOR", 
  "CELULAR", "APLICATIVO", "BIBLIOTECA", "FRAMEWORK", "ALGORITMO", 
  "ESTRUTURA", "VARIAVEL", "CONSTANTE", "FUNCAO", "OBJETO", "CLASSE", 
  "HERANCA", "POLIMORFISMO", "ENCAPSULAMENTO", "INTERFACE", "PROGRAMACAO", 
  "SISTEMA", "OPERACIONAL", "HARDWARE", "SOFTWARE", "INTERNET", "NAVEGADOR", 
  "SERVIDOR", "CLIENTE", "PROTOCOLO", "REQUISICAO", "RESPOSTA", "BANCO",
  "DADOS", "CONSULTA", "CODIGO", "FONTE"
];

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

// --- Função para selecionar uma palavra aleatória ---
const getRandomWord = () => WORDS[Math.floor(Math.random() * WORDS.length)];

// --- Componente para desenhar o boneco da forca ---
const HangmanDrawing = ({ wrongGuesses }) => {
  const parts = [
    // Cabeça
    wrongGuesses > 0 && <Circle key="head" cx="120" cy="80" r="20" stroke="#FFF" strokeWidth="4" fill="transparent" />,
    // Tronco
    wrongGuesses > 1 && <Line key="body" x1="120" y1="100" x2="120" y2="150" stroke="#FFF" strokeWidth="4" />,
    // Braço Direito
    wrongGuesses > 2 && <Line key="right-arm" x1="120" y1="120" x2="150" y2="100" stroke="#FFF" strokeWidth="4" />,
    // Braço Esquerdo
    wrongGuesses > 3 && <Line key="left-arm" x1="120" y1="120" x2="90" y2="100" stroke="#FFF" strokeWidth="4" />,
    // Perna Direita
    wrongGuesses > 4 && <Line key="right-leg" x1="120" y1="150" x2="150" y2="180" stroke="#FFF" strokeWidth="4" />,
    // Perna Esquerda
    wrongGuesses > 5 && <Line key="left-leg" x1="120" y1="150" x2="90" y2="180" stroke="#FFF" strokeWidth="4" />,
  ];

  return (
    <View style={styles.drawingContainer}>
      <Svg height="250" width="200">
        {/* Forca */}
        <Line x1="20" y1="230" x2="100" y2="230" stroke="#FFF" strokeWidth="4" />
        <Line x1="60" y1="230" x2="60" y2="40" stroke="#FFF" strokeWidth="4" />
        <Line x1="60" y1="40" x2="120" y2="40" stroke="#FFF" strokeWidth="4" />
        <Line x1="120" y1="40" x2="120" y2="60" stroke="#FFF" strokeWidth="4" />
        {/* Boneco */}
        {parts}
      </Svg>
    </View>
  );
};

export default function App() {
  const [secretWord, setSecretWord] = useState('');
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wrongGuesses, setWrongGuesses] = useState(0);
  const [gameStatus, setGameStatus] = useState('playing'); // 'playing', 'won', 'lost'

  const MAX_WRONG_GUESSES = 6;

  // --- Função para iniciar/reiniciar o jogo ---
  const resetGame = useCallback(() => {
    setSecretWord(getRandomWord());
    setGuessedLetters([]);
    setWrongGuesses(0);
    setGameStatus('playing');
  }, []);

  // --- Inicia o jogo na primeira renderização ---
  useEffect(() => {
    resetGame();
  }, [resetGame]);

  // --- Lógica para lidar com uma tentativa ---
  const handleGuess = (letter) => {
    if (gameStatus !== 'playing' || guessedLetters.includes(letter)) {
      return;
    }

    const newGuessedLetters = [...guessedLetters, letter];
    setGuessedLetters(newGuessedLetters);

    if (!secretWord.includes(letter)) {
      setWrongGuesses(prev => prev + 1);
    }
  };
  
  // --- Verifica o status do jogo (vitória/derrota) a cada tentativa ---
  useEffect(() => {
    if(!secretWord) return;

    // Vitória
    const isWinner = secretWord.split('').every(letter => guessedLetters.includes(letter));
    if (isWinner) {
      setGameStatus('won');
      return;
    }

    // Derrota
    if (wrongGuesses >= MAX_WRONG_GUESSES) {
      setGameStatus('lost');
    }
  }, [guessedLetters, wrongGuesses, secretWord]);


  // --- Renderização da palavra com underlines ---
  const renderWord = () => {
    return (
      <View style={styles.wordContainer}>
        {secretWord.split('').map((letter, index) => (
          <Text key={index} style={styles.wordLetter}>
            {guessedLetters.includes(letter) ? letter : '_'}
          </Text>
        ))}
      </View>
    );
  };

  // --- Renderização do teclado virtual ---
  const renderKeyboard = () => {
    return (
      <View style={styles.keyboardContainer}>
        {ALPHABET.map((letter) => {
          const isGuessed = guessedLetters.includes(letter);
          return (
            <TouchableOpacity
              key={letter}
              style={[styles.key, isGuessed && styles.keyGuessed]}
              onPress={() => handleGuess(letter)}
              disabled={isGuessed || gameStatus !== 'playing'}
            >
              <Text style={styles.keyText}>{letter}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Jogo da Forca</Text>
        
        <HangmanDrawing wrongGuesses={wrongGuesses} />

        <Text style={styles.attemptsText}>
          Tentativas restantes: {MAX_WRONG_GUESSES - wrongGuesses}
        </Text>

        {renderWord()}
        
        {gameStatus === 'playing' && renderKeyboard()}

        {/* --- Modal de Vitória/Derrota --- */}
        <Modal
          transparent={true}
          animationType="fade"
          visible={gameStatus === 'won' || gameStatus === 'lost'}
          onRequestClose={() => {}}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>
                {gameStatus === 'won' ? 'Você Venceu! 🎉' : 'Você Perdeu! 😢'}
              </Text>
              <Text style={styles.modalText}>
                A palavra era:
              </Text>
              <Text style={styles.modalWord}>{secretWord}</Text>
              <TouchableOpacity style={styles.restartButton} onPress={resetGame}>
                <Text style={styles.restartButtonText}>Jogar Novamente</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1a2a33',
  },
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#66fcf1',
    marginBottom: 20,
    fontFamily: 'monospace',
  },
  drawingContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  attemptsText: {
    fontSize: 18,
    color: '#c5c6c7',
    marginBottom: 20,
  },
  wordContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 30,
  },
  wordLetter: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#FFF',
    marginHorizontal: 5,
    borderBottomWidth: 3,
    borderColor: '#66fcf1',
    minWidth: 30,
    textAlign: 'center',
    paddingBottom: 5,
  },
  keyboardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  key: {
    backgroundColor: '#45a29e',
    margin: 4,
    borderRadius: 8,
    width: 40,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyGuessed: {
    backgroundColor: '#0b0c10',
    opacity: 0.6,
  },
  keyText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    backgroundColor: '#1a2a33',
    padding: 30,
    borderRadius: 15,
    alignItems: 'center',
    width: '85%',
    borderWidth: 2,
    borderColor: '#66fcf1',
  },
  modalTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#66fcf1',
    marginBottom: 15,
  },
  modalText: {
    fontSize: 18,
    color: '#c5c6c7',
    marginBottom: 10,
  },
  modalWord: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 25,
    letterSpacing: 3,
  },
  restartButton: {
    backgroundColor: '#45a29e',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
  },
  restartButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

