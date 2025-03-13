import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import { MaterialIcons, Entypo } from "@expo/vector-icons";

// Component to render each individual goal item in the list
const GoalItem = ({ item, onEdit, onDelete }) => (
  <View style={styles.goalItem}>
    {/* Display the goal text */}
    <Text style={styles.goalText}>{item.text}</Text>
    {/* Container for the edit and delete icons */}
    <View style={styles.iconContainer}>
      {/* When pressed, triggers editing mode for this goal */}
      <TouchableOpacity onPress={() => onEdit(item)}>
        <Entypo name="edit" size={24} color="#2980b9" />
      </TouchableOpacity>
      {/* When pressed, deletes this goal from the list */}
      <TouchableOpacity onPress={() => onDelete(item.id)}>
        <MaterialIcons name="delete" size={24} color="#c0392b" />
      </TouchableOpacity>
    </View>
  </View>
);

// Main application component
export default function App() {
  // State to hold the current text input value (i.e., the goal text)
  const [goal, setGoal] = useState("");
  // State to hold the list of goals; each goal has an id and text
  const [goalList, setGoalList] = useState([]);
  // State to track if we're currently editing an existing goal
  const [editingGoal, setEditingGoal] = useState(null);

  // Function to add a new goal or update an existing one
  const handleAddOrUpdateGoal = () => {
    // Ignore if the input text is empty or only spaces
    if (goal.trim().length === 0) return;

    // Check if we are in edit mode
    if (editingGoal) {
      // Update the existing goal by mapping through the current list
      setGoalList((prevGoals) =>
        prevGoals.map((item) =>
          // If the id matches, update its text; otherwise, keep the goal as is
          item.id === editingGoal.id ? { ...item, text: goal } : item
        )
      );
      // Clear editing state since the update is complete
      setEditingGoal(null);
    } else {
      // Create a new goal object and add it to the list
      // Date.now() is used here to generate a unique id based on the current timestamp
      setGoalList((prevGoals) => [
        ...prevGoals,
        { id: Date.now().toString(), text: goal },
      ]);
    }
    // Clear the input field after adding or updating the goal
    setGoal("");
  };

  // Function to delete a goal based on its id
  const handleDeleteGoal = (id) => {
    // Filter out the goal with the matching id from the list
    setGoalList((prevGoals) => prevGoals.filter((goal) => goal.id !== id));
  };

  // Function to enable edit mode for a selected goal
  const handleEditGoal = (goalItem) => {
    // Set the current input to the goal's text so it can be edited
    setGoal(goalItem.text);
    // Set the editingGoal state to the selected goal to indicate edit mode
    setEditingGoal(goalItem);
  };

  return (
    <View style={styles.container}>
      {/* App title */}
      <Text style={styles.title}>📝 My To-Do List</Text>

      {/* Input container for adding a new goal */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter a goal..."
          placeholderTextColor="#7f8c8d"
          value={goal}
          // Updates the 'goal' state as the user types
          onChangeText={setGoal}
          // When the user presses the "enter" or "done" key on the keyboard,
          // this event is triggered to add or update the goal.
          onSubmitEditing={handleAddOrUpdateGoal}
          // Change the return key on the keyboard to display "done"
          returnKeyType="done"
        />
        {/* Button to add or update the goal */}
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddOrUpdateGoal}
        >
          {/* Button text changes based on whether we're editing or adding */}
          <Text style={styles.addButtonText}>
            {editingGoal ? "UPDATE" : "ADD"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* List displaying all the goals */}
      <FlatList
        data={goalList}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          // Render each goal item using the GoalItem component
          <GoalItem
            item={item}
            onEdit={handleEditGoal}
            onDelete={handleDeleteGoal}
          />
        )}
        style={styles.listContainer}
      />
    </View>
  );
}

// Styles for the components
const styles = StyleSheet.create({
  container: {
    flex: 1, // Occupies the full screen
    padding: 20, // Adds padding around the container
    backgroundColor: "#ecf0f1", // Light gray background
  },
  title: {
    fontSize: 26, // Larger font size for the title
    fontWeight: "bold", // Bold text for the title
    textAlign: "center", // Center the title horizontally
    marginBottom: 20, // Space below the title
    color: "#34495e", // Dark blue-gray color
    fontFamily: "Georgia", // Custom font family for the title
  },
  inputContainer: {
    flexDirection: "row", // Arranges TextInput and button side by side
    alignItems: "center", // Aligns children vertically centered
    marginBottom: 10, // Space below the input container
  },
  input: {
    flex: 1, // Takes up available horizontal space
    borderWidth: 1, // Border width around the input field
    borderColor: "#e74c3c", // Red border color
    padding: 10, // Padding inside the input field
    borderRadius: 5, // Rounded corners for the input
    backgroundColor: "#fff", // White background for the input
    fontFamily: "Courier New", // Custom font for input text
    color: "#2c3e50", // Text color inside the input
  },
  addButton: {
    backgroundColor: "#27ae60", // Green background for the button
    paddingVertical: 10, // Vertical padding for the button
    paddingHorizontal: 15, // Horizontal padding for the button
    borderRadius: 5, // Rounded corners for the button
    marginLeft: 10, // Space between the input and button
  },
  addButtonText: {
    color: "#fff", // White text color for the button
    fontWeight: "bold", // Bold text in the button
    fontFamily: "Courier New", // Custom font for the button text
  },
  listContainer: {
    flex: 1, // Takes up remaining space for the list
  },
  goalItem: {
    flexDirection: "row", // Arranges goal text and icons in a row
    justifyContent: "space-between", // Distributes space between text and icons
    alignItems: "center", // Centers items vertically
    padding: 15, // Padding inside each goal item
    backgroundColor: "#bdc3c7", // Background color for the goal item
    borderRadius: 5, // Rounded corners for each goal item
    marginVertical: 5, // Vertical spacing between items
  },
  goalText: {
    fontSize: 18, // Font size for the goal text
    fontWeight: "bold", // Bold text for the goal
    color: "#2c3e50", // Text color for the goal
    fontFamily: "Courier New", // Custom font for the goal text
  },
  iconContainer: {
    flexDirection: "row", // Arranges icons side by side
    gap: 10, // Space between the icons (supported in newer React Native versions)
  },
});
