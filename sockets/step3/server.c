/* server.c */
#include <netinet/in.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/socket.h>
#include <unistd.h>
#include <stdbool.h> 

#define SERVER "SERVER"
#include "importantconstants.h"


char * interpreteMessage(int clientId, char * message, int bufferSize) ;
#include "serverlib.c"

int main(int argc, char const* argv[])
{
    
    int socketId;
    int incomingSocket, nbBytesRead, serverFileDescr;
    struct sockaddr_in serverAddress;
    int opt = 1;
    int addressLength = sizeof(serverAddress);
    char buffer[BUFFER_SIZE] = { 0 };
    char* serverGreetings = "Hey there! I am the server!\0";

    
    /* Start setting up the server */
    if ((serverFileDescr = socket(AF_INET, SOCK_STREAM, 0)) < 0) {
        perror("\nSERVER: failed to create a socket");
        exit(EXIT_FAILURE);
    }
  
    /* Attempt to attach to port defined in header probably port 9090 */ 
    if (setsockopt(serverFileDescr, SOL_SOCKET,
                   SO_REUSEADDR | SO_REUSEPORT, &opt,
                   sizeof(opt))) {
        perror("\nSERVER: Attachng to port failed");
        exit(EXIT_FAILURE);
    }

    serverAddress.sin_family = AF_INET;
    serverAddress.sin_addr.s_addr = INADDR_ANY;
    serverAddress.sin_port = htons(PORT);
  
    // Attempt to bind
    if (bind(serverFileDescr, (struct sockaddr*)&serverAddress,
             sizeof(serverAddress))
        < 0) {
        perror("\nSERVER: Attempted to bind but failed");
        exit(EXIT_FAILURE);
    }

    /* Now we attempt to listen */
    if (listen(serverFileDescr, 3) < 0) {
        perror("\nSERVER: Attempted to listed but failed");
        exit(EXIT_FAILURE);
    }
    
    
    printf("\nSERVER: Started Server and listening on port %d\n", PORT);
    printf("%s",serverGreetings);


    

    incomingSocket = accept(serverFileDescr, (struct sockaddr*)&serverAddress, (socklen_t*)&addressLength);
    if (incomingSocket < 0 ) {
        perror("\nSERVER: Failed to accept an incoming connection");
        exit(EXIT_FAILURE);
    }
    
    /* Read whatever the client has to say */
    nbBytesRead = read(incomingSocket, buffer, BUFFER_SIZE);

    /* security flaw below, the client could send more */
            if ( nbBytesRead >= BUFFER_SIZE)
                nbBytesRead = BUFFER_SIZE-1;
    
    /* first we terminate whatever we recieved with the null character */
    buffer[nbBytesRead] = END_OF_STRING ;

    char * interpMess = interpreteMessage(incomingSocket, buffer, nbBytesRead) ;

    printf("\nSERVER: Received work from client : %s\n",interpMess);

    char * result = performWork(incomingSocket, buffer, nbBytesRead);
    result[BUFFER_SIZE-1] = END_OF_STRING;

    send(incomingSocket, result, strlen(result), 0);
    
  
    // closing the connected socket
    close(incomingSocket);
    // closing the listening socket
    shutdown(serverFileDescr, SHUT_RDWR);
    return 0;
}