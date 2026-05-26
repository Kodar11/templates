import { useState, useEffect } from "react";
import axios from "axios";

function Contacts({ token }) {
  const [contacts, setContacts] = useState([]);
  const [newContact, setNewContact] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
  });
  const [editingContactId, setEditingContactId] = useState(null);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await axios.get("/api/contacts/getContacts", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Fetched contacts:", response.data); // Debug log
        setContacts(response.data);
      } catch (error) {
        console.error("Failed to fetch contacts:", error);
      }
    };

    if (token) {
      fetchContacts();
    }
  }, [token]);

  const handleInputChange = (e) => {
    setNewContact({ ...newContact, [e.target.name]: e.target.value });
  };

  const handleAddContact = async (e) => {
    e.preventDefault();

    const optimisticContact = {
      id: Date.now(), // Temporary ID
      ...newContact,
    };

    setContacts((prevContacts) => [...prevContacts, optimisticContact]);

    try {
      const response = await axios.post("/api/contacts/addContact", newContact, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Added contact:", response.data); // Debug log

      setContacts((prevContacts) =>
        prevContacts.map((contact) =>
          contact.id === optimisticContact.id ? response.data : contact
        )
      );

      setNewContact({ name: "", phone: "", email: "", address: "" });
    } catch (error) {
      console.error("Failed to add contact:", error);

     
      setContacts((prevContacts) =>
        prevContacts.filter((contact) => contact.id !== optimisticContact.id)
      );
    }
  };

  const handleDeleteContact = async (id) => {
    try {
      await axios.delete(`/api/contacts/deleteContact/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setContacts((prevContacts) => prevContacts.filter((contact) => contact.id !== id));
    } catch (error) {
      console.error("Failed to delete contact:", error);
    }
  };

  const handleUpdateContact = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `/api/contacts/updateContact/${editingContactId}`,
        newContact,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setContacts((prevContacts) =>
        prevContacts.map((contact) =>
          contact.id === editingContactId
            ? { ...contact, ...newContact }
            : contact
        )
      );
      setEditingContactId(null);
      setNewContact({ name: "", phone: "", email: "", address: "" });
    } catch (error) {
      console.error("Failed to update contact:", error);
    }
  };

  const handleEditContact = (contact) => {
    setEditingContactId(contact.id);
    setNewContact({
      name: contact.name,
      phone: contact.phone,
      email: contact.email,
      address: contact.address,
    });
  };

  return (
    <div className="container mx-auto mt-10 px-4 bg-white">
      <div className="max-w-2xl mx-auto bg-orange-100 shadow-lg rounded-lg p-8">
        <h2 className="text-3xl font-bold text-orange-600 mb-8 text-center">
          {editingContactId ? "Edit Contact" : "Add Contact"}
        </h2>

        <form onSubmit={editingContactId ? handleUpdateContact : handleAddContact}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Name</label>
              <input
                type="text"
                name="name"
                placeholder="John Doe"
                className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-orange-500 focus:border-orange-500 transition duration-200 bg-white text-gray-800"
                value={newContact.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
              <input
                type="text"
                name="phone"
                placeholder="(123) 456-7890"
                className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-orange-500 focus:border-orange-500 transition duration-200 bg-white text-gray-800"
                value={newContact.phone}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
              <input
                type="email"
                name="email"
                placeholder="john.doe@example.com"
                className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-orange-500 focus:border-orange-500 transition duration-200 bg-white text-gray-800"
                value={newContact.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Address</label>
              <input
                type="text"
                name="address"
                placeholder="123 Main St"
                className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-orange-500 focus:border-orange-500 transition duration-200 bg-white text-gray-800"
                value={newContact.address}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="mt-8 text-center">
            <button
              type="submit"
              className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-500 transition duration-200"
            >
              {editingContactId ? "Update Contact" : "Add Contact"}
            </button>
          </div>
        </form>
      </div>

      <div className="mt-16 max-w-4xl mx-auto px-4">
        <h2 className="text-2xl font-semibold text-orange-600 mb-4 text-center">Your Contacts</h2>

        <div className="bg-orange-100 shadow-lg rounded-lg p-6">
          <ul>
            {contacts.map((contact) => (
              <li
                key={contact.id}
                className="border-b border-gray-300 py-6 flex justify-between items-center"
              >
                <div>
                  <p className="text-lg font-semibold text-gray-800">{contact.name}</p>
                  <p className="text-gray-600">{contact.phone}</p>
                  <p className="text-gray-600">{contact.email}</p>
                  <p className="text-gray-600">{contact.address}</p>
                </div>
                <div className="flex space-x-4">
                  <button
                    onClick={() => handleEditContact(contact)}
                    className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-400 transition duration-200 flex items-center"
                  >
                    <span className="material-icons">edit</span>
                  </button>
                  <button
                    onClick={() => handleDeleteContact(contact.id)}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-500 transition duration-200 flex items-center"
                  >
                    <span className="material-icons">delete</span>
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Contacts;
