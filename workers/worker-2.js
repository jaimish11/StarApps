this.onmessage = e => {
    server = e.data.id
    switch(e.data.action){
        case "start":
            console.log("Starting thread - "+server);
            setInterval(()=>{
                postMessage({id:server, action:"start"});
            },5000);
        break;

        case "stop":
            console.log("Stopping thread - "+server)
            postMessage({id:server, action:"stop"});
            close();
        break;
        case "pause":
            console.log("Pausing thread - "+server)
            postMessage({id:server, action:"paused"});
            close();
        break;

        default:
            postMessage("Unknown action");
    }
   
    
}