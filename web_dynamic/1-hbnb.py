#!/usr/bin/python3
"""
Flask App that integrates with AirBnB static HTML Template.
"""

from flask import Flask, render_template
from models import storage
import uuid

# Flask setup
app = Flask(__name__)
app.url_map.strict_slashes = False
port = 5000
host = '0.0.0.0'

# Close the database session after each request
@app.teardown_appcontext
def teardown_db(exception):
    """
    Close the current SQLAlchemy Session.
    """
    storage.close()

@app.route('/1-hbnb')
def hbnb_filters():
    """
    Render the HBNB filters page with dynamic data.
    """
    # Retrieve all state objects and organize them by name
    state_objs = storage.all('State').values()
    states = {state.name: state for state in state_objs}
    
    # Retrieve all amenity objects
    amens = storage.all('Amenity').values()
    
    # Retrieve all place objects
    places = storage.all('Place').values()
    
    # Create a dictionary of users with user ID as the key
    users = {user.id: f"{user.first_name} {user.last_name}" for user in storage.all('User').values()}
    
    # Render the template with the gathered data
    return render_template('1-hbnb.html',
                           cache_id=uuid.uuid4(),
                           states=states,
                           amens=amens,
                           places=places,
                           users=users)

if __name__ == "__main__":
    """
    Main entry point for the Flask app.
    """
    app.run(host=host, port=port)
