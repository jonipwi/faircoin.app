export function WalletSection() {
  return (
    <section id="wallet" className="section">
      <div className="container">
        <div className="card p-6">
          <h2 className="text-2xl font-semibold">My Wallet</h2>
          <p className="text-gray-600 mt-2">Login required to view wallet. Auth wiring to backend can be added next.</p>
          <div className="grid sm:grid-cols-2 gap-4 mt-6">
            <div className="card p-5 text-center">
              <div className="text-sm text-gray-600">Available Balance</div>
              <div id="walletBalance" className="text-3xl font-bold text-primary">0.00 FC</div>
            </div>
            <div className="card p-5 text-center">
              <div className="text-sm text-gray-600">Locked/Vesting</div>
              <div id="walletLocked" className="text-3xl font-bold text-primary">0.00 FC</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
