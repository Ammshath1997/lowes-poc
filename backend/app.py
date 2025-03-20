import asyncio
import json
import websockets

async def session_handler(client_websocket: websockets.WebSocketServerProtocol):
    """Handles WebSocket connection and returns whatever is received as response."""
    try:
        # Listen for messages from the client
        async for message in client_websocket:
            print(f"Received message: {message}")

            # Simply send back the message received from the client as the response
            await client_websocket.send(message)
            print(f"Sent back: {message}")
            
    except Exception as e:
        print(f"Error during WebSocket communication: {e}")
    finally:
        print("WebSocket connection closed.")

async def main() -> None:
    """Runs the WebSocket server on port 2305."""
    async with websockets.serve(session_handler, "localhost", 2305):
        print("WebSocket server running at ws://localhost:2305...")
        await asyncio.Future()  # Keep the server running indefinitely

if __name__ == "__main__":
    asyncio.run(main())