import React, { Component }  from 'react';
import { Button, Modal } from 'react-bootstrap';
import { SketchPicker } from 'react-color';
import reactCSS from 'reactcss';
import getWeb3 from "../utils/getWeb3";
import './App.css';
import Marble from '../abis/Marble.json'

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
            marbles: [],
            marbleName: 'Marble Token ',
            marbleBorder: 50,
            showModal: false,
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

    const networkId = await web3.eth.net.getId();
    const networkData = Marble.networks[networkId];
    if(networkData) {
      const abi = Marble.abi;
      const address = networkData.address;
      const contract = new web3.eth.Contract(abi, address);
      this.setState({ contract })
      const totalSupply = await contract.methods.totalSupply().call();
      this.setState({ totalSupply, marbleName: 'Marble Token ' + totalSupply});
      // Load Marbles
      for (let i = 1; i <= totalSupply; i++) {
        const marble = await contract.methods.marbles(i - 1).call();
        this.setState({
            marbles: [...this.state.marbles, marble]
        })
      }
    } else {
      window.alert('Smart contract not deployed to detected network.')
    }
  }

  mint = (color, border, name) => {
        console.log(color);
      console.log(border);
      console.log(name);
    this.state.contract.methods.mint(color, border, name).send({ from: this.state.account })
    .on('transactionHash', (receipt) => {
      this.setState({
          marbles: [...this.state.marbles, {color: color, border: border, name: name}]
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


    handleCloseModal = () => {
        this.setState({showModal: false});
    };
    handleShowModal = () => {
        this.setState({showModal: true});
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
              Marble Tokens
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

                  <Button variant="primary" onClick={this.handleShowModal}>
                      Issue Token
                  </Button>

                  {/* Modal */}
                  <Modal show={this.state.showModal} onHide={this.handleCloseModal}>
                      <Modal.Header closeButton>
                          <Modal.Title>Create a Marble</Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                          <form onSubmit={(event) => {
                              event.preventDefault();
                              this.mint(this.state.selectedColor, 50, this.state.marbleName)
                          }}>

                              <table>
                              <tr>
                              <td>
                              <tr>
                                  <td>Marble Name:</td>
                                  <td>
                                  <input
                                  type='text'
                                  className='form-control mb-1'
                                  value={this.state.marbleName}
                                  onChange={(input) => {
                                      this.setState({marbleName: input.target.value})}} />
                                  </td>
                              </tr>

                              <tr>
                                  <td>Marble Color:</td>
                                  <td>
                                  <div>
                                  <div style={ styles.swatch } onClick={ this.handleClick }>
                                      <div style={ styles.color } />
                                  </div>
                                  { this.state.displayColorPicker ? <div style={ styles.popover }>
                                      <div style={ styles.cover } onClick={ this.handleClose }/>
                                      <SketchPicker color={ this.state.selectedColor } onChange={ this.handleChange } />
                                  </div> : null }

                                    </div>
                                  </td>
                              </tr>

                                  <tr>
                                      <td>Marble Border:</td>
                                      <td>

                                          <input
                                              type="range"
                                              min="1"
                                              max="100"
                                              value={this.state.marbleBorder}
                                              onChange={(input) => {
                                                  console.log(input.target.value);
                                                  this.setState({marbleBorder: input.target.value})}} />
                                      </td>
                                  </tr>
                              </td>

                                  <td>

                                      <div className="tokenPreview" style={{ backgroundColor: this.state.selectedColor, borderRadius: parseInt(this.state.marbleBorder) }}></div>

                                  </td>

                              </tr>

                              </table>
                          </form>





                      </Modal.Body>
                      <Modal.Footer>
                          <Button variant="secondary" onClick={this.handleCloseModal}>
                              Close
                          </Button>
                          <Button variant="primary" onClick={() => {
                              this.handleCloseModal();
                              this.mint(this.state.selectedColor, this.state.marbleBorder, this.state.marbleName);

                          }}>
                              Mint
                          </Button>
                      </Modal.Footer>
                  </Modal>




              </div>
            </main>
          </div>
          <hr/>
          <div className="row text-center">
            { this.state.marbles.map((marble, key) => {

                console.log(parseInt(marble.border));
              return(
                <div key={key} className="col-md-3 mb-3">
                  <div className="token" style={{ backgroundColor: marble.color, borderRadius: parseInt(marble.border) }}></div>
                  <div>{marble.name}</div>
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
