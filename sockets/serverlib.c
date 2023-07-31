
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <inttypes.h>


char * interpreteMessage(int clientId, char * message, int bufferSize) {
    if (message == NULL || bufferSize < 1 || bufferSize > BUFFER_SIZE) {
        printf("\nInvalid work request we got from %d", clientId);
        return "Invalid work request";
    }
        

    char * decodedMessage = NULL;

    decodedMessage = (char *) malloc(BUFFER_SIZE * sizeof(char)); 
    if (decodedMessage == NULL )
        return "Failed to allocate memory";

    memset(decodedMessage, '\0', BUFFER_SIZE);
    int c,k=0,x ;
    
    for ( c = 0 ; c < bufferSize;  c++ ) {
            
        switch (message[c]) {
            case ADD:
                x = strlen("ADD") ;
                memcpy(decodedMessage + k, "ADD", x);
                k += x ;
                break;
            case SUB:
                x = strlen("SUBTRACT") ;
                memcpy(decodedMessage + k, "SUBTRACT", x);
                k += x ;
                break;
            case DIVIDE :
                x = strlen("DIVIDE") ;
                memcpy(decodedMessage + k, "DIVIDE", x);
                k += x ;
                break;
            case MULTIPLY:
                x = strlen("MULTIPLY") ;
                memcpy(decodedMessage + k, "MULTIPLY", x);
                k += x ;
                break;
            case SEPERATOR:
                x = strlen(" ") ;
                memcpy(decodedMessage + k, " ", x);
                k += x ;
                break;
            case WORKREQUEST:
                x = strlen("NEW_WORK_REQUEST") ;
                memcpy(decodedMessage + k, "NEW_WORK_REQUEST", x);
                k += x ;
                break;
            default:
                memcpy(decodedMessage + k, &(message[c]), 1);
                k += 1 ;
                
                break;
        }

    }
    return decodedMessage;
}


char * performWork(int clientId, char * message, int bufferSize) {
    if (message == NULL || bufferSize < 1 || bufferSize > BUFFER_SIZE) {
        printf("\nInvalid work request we got from %d", clientId);
        return "Invalid work request";
    }
        

    char * result = NULL;

    result = (char *) malloc(BUFFER_SIZE * sizeof(char)); 
    if (result == NULL )
        return "Failed to allocate memory";

    memset(result, '\0', BUFFER_SIZE);
    int x,y,z ;
    
    char operator = message[2];
    
    
        
    switch (operator) {
        case ADD: 
        
            x = atoi((message + 4));
            y = atoi((message + 6));
            z = x + y ;
            sprintf(result, "%d", z);
            break;
        case SUB:
            x = atoi((message + 4));
            y = atoi((message + 6));
            z = x - y ;
            sprintf(result, "%d", z);
            break;
        case DIVIDE :
            x = atoi((message + 4));
            y = atoi((message + 6));
            if ( y != 0) {
                z = x / y ;
                sprintf(result, "%d", z);
            } else {
                memcpy(result, "Cannot divide by 0", strlen( "Cannot divide by 0"));
            }
            
            break;
        case MULTIPLY:
            x = atoi((message + 4));
            y = atoi((message + 6));
            z = x * y ;
            sprintf(result, "%d", z);
            break;
        
    }

    
    return result;
}
