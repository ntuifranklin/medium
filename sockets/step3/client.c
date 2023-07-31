/* client.c */
#include <arpa/inet.h>
#include <stdio.h>
#include <string.h>
#include <sys/socket.h>
#include <unistd.h>
#include <stdbool.h> 

#define CLIENT "CLIENT"
#include "importantconstants.h"
  
int main(int argc, char const* argv[])
{
    int clientFileDescriptor,connectionState,  nbBytesRead;
    struct sockaddr_in serv_addr;
    char message[BUFFER_SIZE] ;
    char buffer[BUFFER_SIZE] = { 0 };
    if ((clientFileDescriptor = socket(AF_INET, SOCK_STREAM, 0)) < 0) {
        printf("\nCLIENT: Socket creation error \n");
        return -1;
    }
  
    serv_addr.sin_family = AF_INET;
    serv_addr.sin_port = htons(PORT);
  
    
    if (inet_pton(AF_INET, LOCALHOST, &serv_addr.sin_addr)
        <= 0) {
        printf(
            "\nCLIENT: Invalid address/ Address not supported \n");
        return -1;
    }
  
    if ((connectionState
         = connect(clientFileDescriptor, (struct sockaddr*)&serv_addr,
                   sizeof(serv_addr)))
        < 0) {
        printf("\nCLIENT: Connection Failed \n");
        return -1;
    }
    
    /* set \0 every where in message */
    memset(message, END_OF_STRING,BUFFER_SIZE);
    
    /* set job request by default to perform 1 + 2 */
    message[0] = WORKREQUEST;
    message[1] = SEPERATOR;
    message[2] = ADD ;
    message[3] = SEPERATOR;
    message[4] = '1';
    message[5] = SEPERATOR;
    message[6] = '2';

    /* if 3 command line arguments was given, then we send those to server, else send add 1 1 to server */
    if ( argc  == 4 ) {
        message[2] = argv[1][0]; // operator
        message[4] = argv[2][0]; // operand1
        message[6] = argv[3][0]; // operand2
    }
    
    send(clientFileDescriptor, message, strlen(message), 0);
    printf("Sent work to server : %s\n", message);
    nbBytesRead = read(clientFileDescriptor, buffer, BUFFER_SIZE);
    printf("Received result : %s\n", buffer);
  
    // closing the connected socket
    close(clientFileDescriptor);
    return 0;
}