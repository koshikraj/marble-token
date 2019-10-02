import React, { Component } from 'react';
import { SketchPicker } from 'react-color';
import reactCSS from 'reactcss';
import getWeb3 from "../utils/getWeb3";
import './App.css';
import Color from '../abis/Color.json'

class App extends Component {


    constructor(props) {
        super(props);
        this.state = {
            isConnected: false,
            selectedColor: '#000000',
            displayColorPicker: false,
            account: '',
            contract: null,
            totalSupply: 0,
            colors: []
        }
    }

  async componentWillMount() {
    await this.loadWeb3();
    await this.loadBlockchainData()
  }

  async loadWeb3() {

      // Get network provider and web3 instance.
      this.web3 = await getWeb3();
      let connected = await this.web3.eth.net.isListening();
      if (connected) {
          this.setState({isConnected: true})
      }
  }

  async loadBlockchainData() {
    const web3 = this.web3;
    // Load account
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })

    const networkId = await web3.eth.net.getId()
    const networkData = Color.networks[networkId]
    if(networkData) {
      const abi = Color.abi;
      const address = networkData.address;
      const contract = new web3.eth.Contract(abi, address);
      this.setState({ contract })
      const totalSupply = await contract.methods.totalSupply().call();
      this.setState({ totalSupply });
      // Load Colors
      for (var i = 1; i <= totalSupply; i++) {
        const color = await contract.methods.colors(i - 1).call();
        this.setState({
          colors: [...this.state.colors, color]
        })
      }
    } else {
      window.alert('Smart contract not deployed to detected network.')
    }
  }

  mint = (color) => {
        console.log(color);
    this.state.contract.methods.mint(color).send({ from: this.state.account })
    .on('transactionHash', (receipt) => {
        console.log('created');
      this.setState({
        colors: [...this.state.colors, color]
      })
    })
  };

    handleClick = () => {
        this.setState({ displayColorPicker: !this.state.displayColorPicker })
    };

    handleClose = () => {
        this.setState({ displayColorPicker: false })
    };

    handleChange = (color) => {
        this.setState({ selectedColor: color.hex })
    };


    render() {

      const styles = reactCSS({
          'default': {
              color: {
                  width: '36px',
                  height: '14px',
                  borderRadius: '2px',
                  background: `${ this.state.selectedColor }`,
              },
              swatch: {
                  padding: '5px',
                  background: '#fff',
                  borderRadius: '1px',
                  boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
                  display: 'inline-block',
                  cursor: 'pointer',
              },
              popover: {
                  position: 'absolute',
                  zIndex: '2',
              },
              cover: {
                  position: 'fixed',
                  top: '0px',
                  right: '0px',
                  bottom: '0px',
                  left: '0px',
              },
          },
      });

    return (
      <div>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <a
            className="navbar-brand col-sm-3 col-md-2 mr-0"
            href="#"
            rel="noopener noreferrer"
          >
            Color Tokens
          </a>
            <ul className="navbar-nav px-3">
                <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
                    {this.state.isConnected ? <span className="badge badge-pill badge-success"> connected </span> : <span className="badge badge-pill badge-danger"> disconnected </span>}
                </li>
            </ul>
          <ul className="navbar-nav px-3">
            <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
              <small className="text-white"><span id="account">{this.state.account}</span></small>
            </li>
          </ul>

        </nav>
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                <h1>Issue Token</h1>
                <form onSubmit={(event) => {
                  event.preventDefault()
                  const color = this.color.value
                  this.mint(color)
                }}>
                  <input
                    type='text'
                    className='form-control mb-1'
                    placeholder='#FFFFFF'
                    value={this.state.selectedColor}
                    ref={(input) => { this.color = input }}
                  />
                    <div>
                        <div style={ styles.swatch } onClick={ this.handleClick }>
                            <div style={ styles.color } />
                        </div>
                        { this.state.displayColorPicker ? <div style={ styles.popover }>
                            <div style={ styles.cover } onClick={ this.handleClose }/>
                            <SketchPicker color={ this.state.selectedColor } onChange={ this.handleChange } />
                        </div> : null }

                    </div>
                  <input
                    type='submit'
                    className='btn btn-block btn-primary'
                    value='MINT'
                  />
                </form>
              </div>
            </main>
          </div>
          <hr/>
          <div className="row text-center">
            { this.state.colors.map((color, key) => {
              return(
                <div key={key} className="col-md-3 mb-3">
                  <div className="token" style={{ backgroundColor: color }}></div>
                  <div>{color}</div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
