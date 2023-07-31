/* client.c */
#include <arpa/inet.h>
#include <stdio.h>
#include <string.h>
#include <sys/socket.h>
#include <unistd.h>
#include <stdbool.h> 

#define PORT 9090
#define BUFFER_SIZE (50)

#define LOCALHOST "127.0.0.1"
#define END_OF_STRING '\0'

  
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
    char * clientGreetings = "Hey There, I am the client!\0";
    
    
    message[0] = WORKREQUEST;
    message[1] = SEPERATOR;
    message[2] = ADD ;
    message[3] = SEPERATOR;
    message[4] = '1';
    message[5] = SEPERATOR;
    message[6] = '2';
    if ( argc  == 4 ) {
        message[2] = argv[1][0];
        message[4] = argv[2][0];
        message[6] = argv[3][0];
    }
    printf("\nCLIENT:  Sent a client greetings to the server : %s\n", clientGreetings);
    send(clientFileDescriptor, clientGreetings, strlen(clientGreetings), 0);
    /* Read whatever the server sends to us on this end */
    nbBytesRead = read(clientFileDescriptor, buffer, BUFFER_SIZE);

    /* forcing the termination of the string rea with an end of string character */
    buffer[BUFFER_SIZE-1] = END_OF_STRING;
    printf("\nCLIENT:  Reading from the server : %s\n", buffer);
   
    
    close(clientFileDescriptor);
    return 0;
}