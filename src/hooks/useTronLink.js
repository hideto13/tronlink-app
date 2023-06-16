import { useCallback, useState } from 'react'

export const useTronlink = () => {
  const [trxBalance, setTrxBalance] = useState(0)
  const [isConnected, setIsConnected] = useState(false)
  const [address, setAddress] = useState('')
  const [walletName, setWalletName] = useState('')
  const [rejectConnection, setRejectConnection] = useState(false)

  const connectToWallet = useCallback(async () => {
    if (!window.tronLink) return

    if (window.tronLink) {
      await window.tronLink
        .request({ method: 'tron_requestAccounts' })
        .then(res => {
          if (res.code === 4000) return
          if (res.code === 4001) {
            console.log('rejected')
            setRejectConnection(true)
            return
          }
          const { name, base58 } = window.tronWeb.defaultAddress

          if (base58) {
            setAddress(base58)
            setWalletName(name || '')
            setIsConnected(true)
            window.tronWeb.trx
              .getBalance(base58)
              .then(trxAmount => setTrxBalance(trxAmount))

            tronLinkEventListener()
          } else {
            setIsConnected(false)
          }
        })
    }
  }, [])

  const cleanData = useCallback(() => {
    setTrxBalance(0)
    setIsConnected(false)
    setAddress('')
    setWalletName('')
  }, [])

  const tronLinkEventListener = useCallback(() => {
    window.addEventListener('load', connectToWallet)

    window.addEventListener('message', async msg => {
      const { message } = msg.data

      if (!message) return

      if (
        message.action === 'setAccount' ||
        message.action === 'setNode' ||
        message.action === 'tabReply' ||
        message.action === 'accountsChanged'
      ) {
        if (message.data.address) {
          connectToWallet()
        }

        if (message.action !== 'tabReply' && !message.data.address) {
          cleanData()
        }
      }
    })
  }, [])

  return {
    address,
    isConnected,
    trxBalance,
    walletName,
    connectToWallet,
    rejectConnection,
  }
}
