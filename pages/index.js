import { useState, useEffect, useRef } from 'react';
import useInterval from '@use-it/interval';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Leaderboard from '../components/Leaderboard';
import Delete from '../components/DeletedName';
import axios from 'axios';

export default function SnakeGame() {
    // Canvas Settings
    const canvasRef = useRef(null);
    const canvasWidth = 500;
    const canvasHeight = 380;
    const canvasGridSize = 20;

    // Game Settings
    const minGameSpeed = 10;
    const maxGameSpeed = 15;

    // Game State
    const [gameDelay, setGameDelay] = useState();
    const [countDown, setCountDown] = useState(4);
    const [running, setRunning] = useState(false);
    const [isLost, setIsLost] = useState(false);
    const [highscore, setHighscore] = useState(0);
    const [newHighscore, setNewHighscore] = useState(false);
    const [score, setScore] = useState(0);
    const [snake, setSnake] = useState({
        head: { x: 12, y: 9 },
        trail: []
    });
    const [apple, setApple] = useState({});
    const [velocity, setVelocity] = useState({});
    const [previousVelocity, setPreviousVelocity] = useState({});
    const [name, setName] = useState('');
    const [text, setText] = useState('');
    const [boardList, setBroadList] = useState([]);
    const [save, setSave] = useState(false);
    const [name2, setName2] = useState('');

    const fetchList = async () => {
        const res = await axios.get('http://localhost:5000/api/list');
        setBroadList(res.data);
    };
    const onSubmit = async () => {
        let temp = false;
        if (name == '') {
            return;
        }
        for (let i = 0; i < boardList.length; i++) {
            console.log(boardList[i].name === name);
            if (boardList[i].name === name) {
                temp = true;
                break;
            }
        }
        console.log(temp);
        if (temp === true) {
            const data = { name: name, score: score };
            const res = await axios.patch(
                'http://localhost:5000/api/update',
                data
            );
            setBroadList([...res.data]);
            setSave(true);
        } else {
            const res = await axios.post('http://localhost:5000/api/add', {
                name: name,
                score: score
            });
            setBroadList([...res.data]);
            setText('');
            setSave(true);
        }
    };
    const onChange = ({ target: { value } }) => {
        setName2(value);
    };
    const onEnter = async () => {
      const res =await axios.delete(`http://localhost:5000/api/delete/${name2}`);
        console.log(name2);
        setBroadList(res.data)
    };

    useEffect(() => {
        onSubmit();
        fetchList();
    }, []);

    const clearCanvas = ctx =>
        ctx.clearRect(-1, -1, canvasWidth + 2, canvasHeight + 2);

    const generateApplePosition = () => {
        const x = Math.floor(Math.random() * (canvasWidth / canvasGridSize));
        const y = Math.floor(Math.random() * (canvasHeight / canvasGridSize));
        // Check if random position interferes with snake head or trail
        if (
            (snake.head.x === x && snake.head.y === y) ||
            snake.trail.some(
                snakePart => snakePart.x === x && snakePart.y === y
            )
        ) {
            return generateApplePosition();
        }
        return { x, y };
    };

    // Initialise state and start countdown
    const startGame = () => {
        setSave(false);
        setGameDelay(1000 / minGameSpeed);
        setIsLost(false);
        setScore(0);
        setSnake({
            head: { x: 12, y: 9 },
            trail: []
        });
        setApple(generateApplePosition());
        setVelocity({ dx: 0, dy: -1 });
        setRunning(true);
        setNewHighscore(false);
        setCountDown(3);
    };

    // Reset state and check for highscore
    const gameOver = () => {
        if (score > highscore) {
            setHighscore(score);
            localStorage.setItem('highscore', score);
            setNewHighscore(true);
        }
        setIsLost(true);
        setRunning(false);
        setVelocity({ dx: 0, dy: 0 });
        setCountDown(4);
    };

    const drawSnake = ctx => {
        ctx.fillStyle = '#0170F3';
        ctx.strokeStyle = '#003779';
        ctx.fRect(
            snake.head.x * canvasGridSize,
            snake.head.y * canvasGridSize,
            canvasGridSize,
            canvasGridSize
        );
        ctx.sRect(
            snake.head.x * canvasGridSize,
            snake.head.y * canvasGridSize,
            canvasGridSize,
            canvasGridSize
        );
        snake.trail.forEach(snakePart => {
            ctx.fRect(
                snakePart.x * canvasGridSize,
                snakePart.y * canvasGridSize,
                canvasGridSize,
                canvasGridSize
            );
            ctx.sRect(
                snakePart.x * canvasGridSize,
                snakePart.y * canvasGridSize,
                canvasGridSize,
                canvasGridSize
            );
        });
    };

    const drawApple = ctx => {
        ctx.fillStyle = '#DC3030'; // '#38C172' // '#F4CA64'
        ctx.strokeStyle = '#881A1B'; // '#187741' // '#8C6D1F
        if (
            apple &&
            typeof apple.x !== 'undefined' &&
            typeof apple.y !== 'undefined'
        ) {
            ctx.fRect(
                apple.x * canvasGridSize,
                apple.y * canvasGridSize,
                canvasGridSize,
                canvasGridSize
            );
            ctx.sRect(
                apple.x * canvasGridSize,
                apple.y * canvasGridSize,
                canvasGridSize,
                canvasGridSize
            );
        }
    };

    // Update snake.head, snake.trail and apple positions. Check for collisions.
    const updateSnake = () => {
        // Check for collision with walls
        const nextHeadPosition = {
            x: snake.head.x + velocity.dx,
            y: snake.head.y + velocity.dy
        };
        if (
            nextHeadPosition.x < 0 ||
            nextHeadPosition.y < 0 ||
            nextHeadPosition.x >= canvasWidth / canvasGridSize ||
            nextHeadPosition.y >= canvasHeight / canvasGridSize
        ) {
            gameOver();
        }

        // Check for collision with apple
        if (nextHeadPosition.x === apple.x && nextHeadPosition.y === apple.y) {
            setScore(prevScore => prevScore + 1);
            setApple(generateApplePosition());
        }

        const updatedSnakeTrail = [...snake.trail, { ...snake.head }];
        // Remove trail history beyond snake trail length (score + 2)
        while (updatedSnakeTrail.length > score + 2) updatedSnakeTrail.shift();
        // Check for snake colliding with itsself
        if (
            updatedSnakeTrail.some(
                snakePart =>
                    snakePart.x === nextHeadPosition.x &&
                    snakePart.y === nextHeadPosition.y
            )
        )
            gameOver();

        // Update state
        setPreviousVelocity({ ...velocity });
        setSnake({
            head: { ...nextHeadPosition },
            trail: [...updatedSnakeTrail]
        });
    };

    // Game Hook
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        // Functions to sharpen rectangles drawn
        ctx.fRect = (x, y, w, h) => {
            x = parseInt(x);
            y = parseInt(y);
            ctx.fillRect(x, y, w, h);
        };
        ctx.sRect = (x, y, w, h) => {
            x = parseInt(x) + 0.5;
            y = parseInt(y) + 0.5;
            ctx.strokeRect(x, y, w, h);
        };

        if (!isLost) {
            clearCanvas(ctx);
            drawApple(ctx);
            drawSnake(ctx);
        }
    }, [snake]);

    // Game Update Interval
    useInterval(
        () => {
            if (!isLost) {
                updateSnake();
            }
        },
        running && countDown === 0 ? gameDelay : null
    );

    // Countdown Interval
    useInterval(
        () => {
            setCountDown(prevCountDown => prevCountDown - 1);
        },
        countDown > 0 && countDown < 4 ? 800 : null
    );

    // DidMount Hook for Highscore
    useEffect(() => {
        setHighscore(parseInt(localStorage.getItem('highscore')) || 0);
    }, []);

    // Score Hook: increase game speed starting at 16
    useEffect(() => {
        if (score > minGameSpeed && score <= maxGameSpeed) {
            setGameDelay(1000 / score);
        }
    }, [score]);

    // Event Listener: Key Presses
    useEffect(() => {
        const handleKeyDown = e => {
            if (
                [
                    'ArrowUp',
                    'ArrowDown',
                    'ArrowLeft',
                    'ArrowRight',
                    'w',
                    'a',
                    's',
                    'd'
                ].includes(e.key)
            ) {
                let velocity = {};
                switch (e.key) {
                    case 'ArrowRight':
                        velocity = { dx: 1, dy: 0 };
                        break;
                    case 'ArrowLeft':
                        velocity = { dx: -1, dy: 0 };
                        break;
                    case 'ArrowDown':
                        velocity = { dx: 0, dy: 1 };
                        break;
                    case 'ArrowUp':
                        velocity = { dx: 0, dy: -1 };
                        break;
                    case 'd':
                        velocity = { dx: 1, dy: 0 };
                        break;
                    case 'a':
                        velocity = { dx: -1, dy: 0 };
                        break;
                    case 's':
                        velocity = { dx: 0, dy: 1 };
                        break;
                    case 'w':
                        velocity = { dx: 0, dy: -1 };
                        break;
                    default:
                        console.error('Error with handleKeyDown');
                }
                if (
                    !(
                        previousVelocity.dx + velocity.dx === 0 &&
                        previousVelocity.dy + velocity.dy === 0
                    )
                ) {
                    setVelocity(velocity);
                }
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [previousVelocity]);

    // Input
    const onTextChange = ({ target: { value } }) => {
        setName(value);
        setText(value);
    };

    return (
        <>
            <div>
                <h1 className='title'>Snake Game</h1>
            </div>
            <main>
                <canvas
                    ref={canvasRef}
                    width={canvasWidth + 1}
                    height={canvasHeight + 1}
                />
                <section>
                    <div className='score'>
                        <p>
                            <FontAwesomeIcon icon={['fas', 'star']} />
                            Score: {score}
                        </p>
                        <p>
                            <FontAwesomeIcon icon={['fas', 'trophy']} />
                            Highscore: {highscore > score ? highscore : score}
                        </p>
                    </div>
                    {!isLost && countDown > 0 ? (
                        <button onClick={startGame}>
                            {countDown === 4 ? 'Start Game' : countDown}
                        </button>
                    ) : (
                        <div className='controls'>
                            <p>How to Play?</p>
                            <p>
                                <FontAwesomeIcon icon={['fas', 'arrow-up']} />
                                <FontAwesomeIcon
                                    icon={['fas', 'arrow-right']}
                                />
                                <FontAwesomeIcon icon={['fas', 'arrow-down']} />
                                <FontAwesomeIcon icon={['fas', 'arrow-left']} />
                            </p>
                        </div>
                    )}
                </section>
                {isLost && (
                    <div className='game-overlay'>
                        <p className='large'>Game Over</p>
                        <p className='final-score'>
                            {newHighscore
                                ? `???? New Highscore : ${score} ????`
                                : `You scored: ${score}`}
                        </p>
                        {save ? (
                            <p>Already Save</p>
                        ) : (
                            <div className='row'>
                                <p className='final-score'>
                                    Do you want to save this score ?{' '}
                                </p>

                                <input
                                    className='input'
                                    type='text'
                                    value={text}
                                    onChange={onTextChange}
                                />
                                <button onClick={onSubmit}>Submit</button>
                            </div>
                        )}

                        {!running && isLost && (
                            <button onClick={startGame}>
                                {countDown === 4 ? 'Restart Game' : countDown}
                            </button>
                        )}
                    </div>
                )}
            </main>
            <Leaderboard boardList={boardList}></Leaderboard>
            <div className='admin'>
                <div className='top2'>
                    <p>Admin Delete User</p>
                    <input
                        className='input'
                        value={name2}
                        onChange={onChange}
                    />
                    <button onClick={onEnter}>Delete</button>
                </div>
            </div>
        </>
    );
}
