import { useEffect } from 'react'
import { useTronlink } from './hooks/useTronLink'
import './App.css'

function App() {
  const {
    address,
    isConnected,
    trxBalance,
    walletName,
    connectToWallet,
    rejectConnection,
    network,
    getSign,
  } = useTronlink()

  useEffect(() => {
    const interval = setInterval(async () => {
      if (!isConnected && !rejectConnection) connectToWallet()
      //wallet checking interval 1sec
    }, 1000)
    return () => {
      clearInterval(interval)
    }
  })

  return (
    <div className='App'>
      <header className='App-header'>
        {isConnected ? (
          <>
            <p>Wallet Name: {walletName}</p>
            <p>Address: {address}</p>
            <p>Balance: {trxBalance}</p>
            <p>Network Selected: {network}</p>
            <button className='App-button' onClick={getSign}>
              Get Sign
            </button>
          </>
        ) : (
          <button className='App-button' onClick={connectToWallet}>
            Connect TronLink
          </button>
        )}
      </header>
    </div>
  )
}

export default App
