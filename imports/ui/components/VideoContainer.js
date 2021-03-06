import React from 'react'
import { Button, Modal, Form, Container, Dimmer, Loader } from 'semantic-ui-react'


export default class VideoContainer extends React.Component {

    constructor(props) {

        super(props)
        this.state = {
            open:false,
            url:'error',
            loading:true
        }
    }

    getId(url) {

        if(!url)
            return
        
        var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        var match = url.match(regExp);
    
        if (match && match[2].length == 11) {
            return match[2];
        } else {
            return 'error';
        }
    }

    urlHandle() {
        
        const url = this.url.value.match('^(https?\:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$')
        if(url) {
            const validUrl = url[0]
            if(validUrl) {
                this.setState({
                    url: this.url.value
                })
            }
        }
        else {
            this.setState({
                url:'error'
            })
        }   
    }

    youtubeLink() {
        
        if(this.props.userId == Meteor.userId())
            return (
                
                    
                    <Button style = {{
                        
                    }} onClick = {()=>{
                        this.setState({
                            open:true
                        })
                    }}>Add youtube link</Button>

            )
        else
            return null
    }

    deleteButton() {
        if(this.props.userId == Meteor.userId()) {
            return (
                <Button style = {{marginBottom:'0.8rem'}} onClick = {()=>{

                    const confirmation = confirm('Are you sure want to remove this video?')
                    if(!confirmation)
                        return
                    
                    this.props.addVideo(null)
                    
                }}>X</Button>
            )
        }
        else return null
    }

    render() {

        return(
            <div>
                <Modal size = 'small' open = {this.state.open}>
                    <Modal.Header>
                        Add video
                        <Button className = 'close-button' onClick = {()=>{
                        this.setState({
                            open:false,
                            url:'error'
                        })
                    }}>X</Button>
                    </Modal.Header>
                    <Modal.Content>
                        <Modal.Description>
                            <Form>
                                <Form.Field>
                                    <label>Youtube url</label>
                                    <input onChange = {this.urlHandle.bind(this)} ref = {e => this.url = e}/>
                                </Form.Field>
                                {this.state.url =='error'?null:
                                    <div>
                                        
                                        <iframe 

                                            
                                            width="560" 
                                            height="315" 
                                            src={`//www.youtube.com/embed/${this.getId(this.state.url)}?rel=0&amp;showinfo=0`} 
                                            frameBorder="0" 
                                            allowFullScreen>
                                        </iframe>
                                        <Form.Field>
                                            <Button onClick = {()=>{

                                                this.props.addVideo(this.state.url)
                                                this.setState({
                                                    open:false,
                                                    url:'error'
                                                })
                                            }}>Submit</Button>
                                        </Form.Field>
                                    </div>
                                }
                            </Form>
                        </Modal.Description>
                    </Modal.Content>
                    
                </Modal>

                {
                    this.props.url?
                    <Container>
                        {this.deleteButton()}
                        <br/>                        
                            <Dimmer active = {this.state.loading}>
                                <Loader/>
                            </Dimmer>
                            <iframe
                                onLoad = {()=>{
                                    this.setState({
                                        loading:false
                                    })
                                }}
                                width="720" 
                                height="480" 
                                src={`//www.youtube.com/embed/${this.getId(this.props.url)}?rel=0&amp;showinfo=0`} 
                                frameBorder="0" 
                                allowFullScreen>
                            </iframe>                        
                        <br/>

                    </Container>                   
                    
                    :
                    
                    this.youtubeLink()

                }
            </div>
        )
    }
}