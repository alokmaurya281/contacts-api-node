const asyncHandler = require("express-async-handler");

const Contact = require("../models/contactModel");

// get all contacts
// route GET /api/v1/contacts
//access private

const getAllContacts = asyncHandler(async (req, res) => {
  const contacts = await Contact.find( {user_id: req.user.id});
  res.status(200).json({ data: contacts });
});

// create new contact
// route POST /api/v1/contacts
//access private

const createContact = asyncHandler(async (req, res) => {
  const { name, email, phone } = req.body;
  if (!name || !email || !phone) {
    res.status(400);
    throw new Error("All Fields are required!");
  }
  const contact = await Contact.create({
    name,
    email,
    phone,
    user_id: req.user.id,
  });
  res.status(201).json({ data: contact });
});

// GET  contact
// route GET /api/v1/contacts/:id
//access private
const getContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  if (!contact) {
    res.status(404);
    throw new Error("Contact Not Found");
  }
  if(contact.user_id.toString() !== req.user.id){
    res.status(403);
    throw new Error("You don't have permission to view other users contact...");
  }
  res.status(200).json({ data: contact });
});

// Update particular contact
// route PUT /api/v1/contacts/:id
//access private

const updateContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  if (!contact) {
    res.status(404);
    throw new Error("Contact Not Found");
  }

  if(contact.user_id.toString() !== req.user.id){
    res.status(403);
    throw new Error("You don't have permission to update other users contact...");
  }
  const updatedContact = await Contact.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.status(200).json({ data: updatedContact, success: true });
});

// Delete  contact
// route DELETE /api/v1/contacts
//access private

const deleteContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  if (!contact) {
    res.status(404);
    throw new Error("Contact Not Found");
  }
  if(contact.user_id.toString() !== req.user.id){
    res.status(403);
    throw new Error("You don't have permission to delete other users contact...");
  }
  await Contact.deleteOne({_id: req.params.id});
  res.status(200).json({ message: 'Contact Deleted', data: contact });
});

module.exports = {
  getAllContacts,
  createContact,
  getContact,
  updateContact,
  deleteContact,
};
