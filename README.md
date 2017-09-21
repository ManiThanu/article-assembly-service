# BLOOMBERG MSYN ASSET INGESTION SERVICE
## Architecture
<pre>
                           
    STORY         IMAGE    
      |             |      
 +----V----+   +----V----+ 
 |   RMQ   |   |   API   | 
 +---------+   +---------+ 
      |             |      
     AMQ           AMQ     
      |             |      
 +----V-------------V----+ 
 |        WORKERS        | 
 +-----------------------+ 
            |               
            V               
           AMQ              
                            
</pre>

## Setup
### Node.js
#### NVM
If you have NVM installed already please move to the next step.

For whatever reason NVM doesn't play nice with homebrew. If you found a work around feel free to update the README, otherwise please follow the instructons here: https://github.com/creationix/nvm

#### Node.js
As of 10-25-2016, the engineers behind Node.js do not recommend using version 7 if you are developing for a medium to large enterprise and/or do not have the ability to make on-the-fly platform upgrades: https://nodejs.org/en/blog/release/v7.0.0/. As such, please make sure you have the latest **LTS** (long-term support) version of Node.js installed:

`$ nvm install 6.9.1`

#### Dependencies
* `$ npm install`

### RabbitMQ
* `$ brew install rabbitmq`
* `$ rabbitmq-plugins disable rabbitmq_mqtt`
* `$ rabbitmq-plugins disable rabbitmq_stomp`
* `$ sudo rabbitmq-server`

Admin: http://localhost:15672
Username: guest
Password: guest

### ActiveMQ
* `$ brew install activemq`
* `$ brew services start activemq`

Admin: http://localhost:8161/admin
Username: admin
Password: admin

## Usage
### Run Service
**Asset Assembler** (Worker): `$ npm start`

### Run Test Suite
* `$ npm test`

### Run Code Linter
* `$ npm run lint`

## Contributing
Want to help?

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push upstream my-new-feature`
5. Submit a pull request

## Support
Find a bug? Please create a new issue in Github.
