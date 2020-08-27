const POLL_INTERVAL = 3000;

this.onmessage = e => {
    server = e.data.id
    console.log(e.data.id)
    console.log(e.data.action);
    switch(e.data.action){
        case "start":
            console.log("Starting thread - "+server);
            setInterval(()=>{
                postMessage({id:server, action:"start"});
            },POLL_INTERVAL);
           
        break;

        case "stop":
            console.log("Stopping thread - "+server)
            postMessage({id:server, action:"stop"});
            close();
        break;
        case "pause":
            console.log("Pausing thread - "+server)
            postMessage({id:server, action:"pause"});
            close();
        break;

        default:
            postMessage("Unknown action");
    }
   
    
}