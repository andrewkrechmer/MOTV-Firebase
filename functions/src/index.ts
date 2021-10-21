/* eslint-disable */

import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();

// -- Host writes new event

exports.eventWrite = functions.firestore
    .document("users/{userId}/events/{eventID}")
    .onCreate((snapshot, context) => {

        const event = snapshot.data();

        // Check whether host posted or only drafted event

        if (!(event.usersRelationToEvent == "posted")) {
            return;
        }

        // Add event to events directory of each invitee

        const db = admin.firestore();

        for (const invitee of event.invitees) {
            db.collection("users").doc(invitee.id).collection("events").doc(event.id).set(event);
        }

        return;
        
    });


// -- Updates event

exports.eventUpdate = functions.firestore
    .document("users/{userId}/events/{eventID}")
    .onUpdate((change, context) => {

        const event = change.after.data();

        // Check whether host updated posted or only drafted event

        if (!(event.usersRelationToEvent == "posted")) {
            return;
        }

        // Add event to events directory of each invitee

        const db = admin.firestore();

        for (const invitee of event.invitees) {
            db.collection("users").doc(invitee.id).collection("events").doc(event.id).set(event);
        }

        return;

    });


// -- Host deletes event

exports.eventDelete = functions.firestore
    .document("users/{userId}/events/{eventID}")
    .onDelete((snapshot, context) => {

        const event = snapshot.data();

        // Check whether host deleted posted or only drafted event

        if (!(event.usersRelationToEvent == "posted")) {
            return;
        }

        // Add event to events directory of each invitee

        const db = admin.firestore();

        for (const invitee of event.invitees) {
            db.collection("users").doc(invitee.id).collection("events").doc(event.id).delete();
        }

        return;
        
    });
