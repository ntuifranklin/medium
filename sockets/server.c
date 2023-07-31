// Server side C/C++ program to demonstrate Socket
// programming
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
    int sockets[MAX_CONNECTIONS];
    int noConnections;
    int count;
    int socketId;
    int incomingSocket, nbBytesRead, serverFileDescr;
    struct sockaddr_in serverAddress;
    int opt = 1;
    int addressLength = sizeof(serverAddress);
    char buffer[BUFFER_SIZE] = { 0 };
    char* hello = "Hello from server";
    char work[MAX_CONNECTIONS][BUFFER_SIZE] ;
    char result[MAX_CONNECTIONS][BUFFER_SIZE] ;
  
    /* Initialise all work received and result completed '\0' */
    for( count = 0 ; count < MAX_CONNECTIONS ; count++) {
        memset(work[count], END_OF_STRING, BUFFER_SIZE);
        memset(result[count], END_OF_STRING, BUFFER_SIZE);
    }

    /* Start setting up the server */
    if ((serverFileDescr = socket(AF_INET, SOCK_STREAM, 0)) < 0) {
        perror("failed to create a socket");
        exit(EXIT_FAILURE);
    }
  
    /* Attempt to attach to port defined in header probably port 9090 */ 
    if (setsockopt(serverFileDescr, SOL_SOCKET,
                   SO_REUSEADDR | SO_REUSEPORT, &opt,
                   sizeof(opt))) {
        perror("Attachng to port failed");
        exit(EXIT_FAILURE);
    }

    serverAddress.sin_family = AF_INET;
    serverAddress.sin_addr.s_addr = INADDR_ANY;
    serverAddress.sin_port = htons(PORT);
  
    // Attempt to bind
    if (bind(serverFileDescr, (struct sockaddr*)&serverAddress,
             sizeof(serverAddress))
        < 0) {
        perror("Attempted to bind but failed");
        exit(EXIT_FAILURE);
    }

    /* Now we attempt to listen */
    if (listen(serverFileDescr, 3) < 0) {
        perror("Attempted to listed but failed");
        exit(EXIT_FAILURE);
    }
    
    noConnections = 0;
    printf("Started Server and listening on port %d", PORT);


    while(true) {

        incomingSocket = accept(serverFileDescr, (struct sockaddr*)&serverAddress, (socklen_t*)&addressLength);
        if (incomingSocket >= 0 ) {
            if (noConnections < MAX_CONNECTIONS) {
                sockets[noConnections] = incomingSocket;
                noConnections++;
                printf("\nAccepted an incoming connection");
                printf("\n%d connections so far", noConnections);
            } else {
                
                printf("\nCould not accepted an incoming connection");
                send(incomingSocket, MAX_MESSAGE, strlen(MAX_MESSAGE), 0);
            }
        }
       
        //Now do the work for each received incoming connection
        for (count=0 ; count < noConnections; count++) {
            socketId = sockets[count];
            nbBytesRead = read(socketId, buffer, BUFFER_SIZE);

            /* security flaw below, the client could send more */
            if ( nbBytesRead >= BUFFER_SIZE)
                nbBytesRead = BUFFER_SIZE-1;

            /* terminate whatever we recieved with the null character first */
            work[count][nbBytesRead + 1] = END_OF_STRING ;

            memcpy(work[count], buffer,nbBytesRead);
            printf("\nMessage recieved from clientId %d : ", socketId);
            printf("%s",interpreteMessage(socketId, work[count], nbBytesRead));
            char * r = performWork(socketId, work[count], nbBytesRead) ;
            memcpy(result[count], r, strlen(r));
            
            printf("\nSending message to clientId: %d \n %s ", socketId, result[count]);
            send(socketId, result[count], strlen(result[count]), 0);
            
        } 
        
            
    }
  
    // closing the connected socket
    close(incomingSocket);
    // closing the listening socket
    shutdown(serverFileDescr, SHUT_RDWR);
    return 0;
}