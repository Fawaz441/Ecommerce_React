
import React from 'react'
import { Button, Icon, Image, Item, Label, Container, Segment, Dimmer, Loader, Message, Grid, Divider, Card, Form, Select } from 'semantic-ui-react'
import axios from 'axios'
import { productdetailURL,addToCartURL } from '../constants'
import { cartFetch } from '../store/actions/cart'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { authAxios } from '../utils'

class ProductDetail extends React.Component {
  state = {
    loading: true,
    error: null,
    data: {},
    formVisible: false,
    formdata: {}
  }

  componentDidMount() {
    this.handleFetchDetail();
  }

  handleChange = (e, { name, value }) => {
    const { formdata } = this.state;
    const updatedState = {
      ...formdata,
      [name]: value,
    }
    this.setState({ formdata: updatedState })

  }

  handleToggleForm = () => {
    const { formVisible } = this.state;
    this.setState({ formVisible: !formVisible })
    console.log(formVisible)
  }

  handleFormatData = (formdata) => {
    return Object.keys(formdata).map(key => {
      return formdata[key]
    }) 
  }

  handleAddToCart = (slug)  =>{
    this.setState({loading:true})
    const {formdata} = this.state;
    const variations = this.handleFormatData(formdata)
    console.log(variations);
    authAxios.post(addToCartURL,{slug,variations})
    .then(res => {
      this.setState({loading:false})
    })
    .catch(err => {
      this.setState({error:err,loading:false})
    })

  }

  handleFetchDetail = () => {
    const { match: { params } } = this.props;
    this.setState({ loading: true })
    axios.get(productdetailURL(params.productslug))
      .then(res => {
        this.setState({
          loading: false, data: res.data
        })
      })
      .catch(err => {
        this.setState({ loading: false, error: err })
      })
  }

  render() {
    const { loading, error, data, formVisible, formdata } = this.state;
    console.log(formVisible)
    return (
      <Container>
        {error &&
          <Message negative>
            <Message.Header>Error</Message.Header>
            <p>{JSON.stringify(error)}</p>
          </Message>
        }
        {loading &&
          <Segment>
            <Dimmer active inverted>
              <Loader inverted>Loading</Loader>
            </Dimmer>

            <Image src='/images/wireframe/short-paragraph.png' />
          </Segment>
        }
        <Grid columns={2}>
          <Grid.Row>
            <Grid.Column>
              <Item.Group divided>
                <Item key={data.id}>
                  <Item.Image src={data.image} />

                  <Item.Content>
                    <Item.Header as='a' style={{ 'textTransform': 'capitalize' }}>{data.title}</Item.Header>
                    <Item.Meta>
                      <span className='cinema'>{data.category}</span>
                    </Item.Meta>
                    <Item.Description>{data.description}</Item.Description>
                    <Item.Extra>
                      <Label color={data.label === 'Shirt' ? 'blue' : data.label === 'Secondary' ? 'red' : 'purple'} >{data.label}</Label>
                      <Button primary floated='right' icon labelPosition='right' onClick={this.handleToggleForm}> Add To Cart <Icon name='cart plus' >
                      </Icon></Button>
                    </Item.Extra>
                  </Item.Content>
                </Item>
              </Item.Group>
            </Grid.Column>
            <Divider />
            <Grid.Column>
              <h2>Variations</h2>
              {data.variations && data.variations.map(variation => (
                <Card key={variation.id}>
                  <h3>{variation.name}</h3>
                  {variation.item_variations.map(item_variation => (
                    <React.Fragment key={item_variation.id}>
                      <h4>{item_variation.value}</h4>
                      <Item.Image src={`http://127.0.0.1:8000${item_variation.attachment}`}></Item.Image>
                    </React.Fragment>
                  ))}
                </Card>
              ))}
              {formVisible &&
                <>
                  <Divider />
                  <Form>
                    {data.variations.map(variation => {
                      const variation_jake = variation.name.toLowerCase()
                      return <Form.Field key={variation.id}>
                        <Select
                          name={variation_jake}
                          onChange={this.handleChange}
                          options={variation.item_variations.map(item => {
                            return {
                              key: item.id,
                              text: item.value,
                              value: item.id,
                            }
                          })}
                          placeholder={`Choose a ${variation_jake}`}
                          selection
                          value={formdata[variation_jake]}
                        >

                        </Select>
                      </Form.Field>
                    })}

                    <Form.Button primary onClick={() => this.handleAddToCart(data.slug)}>Submit</Form.Button>
                  </Form>
                </>
              }
            </Grid.Column>
          </Grid.Row>

        </Grid>

      </Container>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    getCart: () => dispatch(cartFetch())
  }
}

export default withRouter(connect(null, mapDispatchToProps)(ProductDetail))
