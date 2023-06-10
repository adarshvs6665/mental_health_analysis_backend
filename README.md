# Mental Health Analysis Backend

`mental_health_analysis_backend` is the backend component of the Mental Health Analysis system. It provides the necessary APIs and services for the frontend applications to interact with and handle the data related to mental health analysis and user profiles.

The Mental Health Analysis system consists of two frontend apps:

- [Mental Health Analysis App](https://github.com/adarshvs6665/mental_health_analysis): The frontend app for users to answer questions, calculate mental health scores, and receive daily tasks. Users can also communicate with doctors through the chat feature.
- [Doctor App](https://github.com/adarshvs6665/doctor_app): The frontend app for doctors to communicate with users, view their profiles, and access other relevant information.

## Getting Started

To run the `mental_health_analysis_backend`, follow the steps below:

### Prerequisites

Before running the backend, make sure you have the following dependencies installed:

- Node.js: Make sure Node.js is installed on your system. If you haven't installed Node.js yet, you can download it from the [official website](https://nodejs.org/).

### Starting MongoDB

The backend requires a MongoDB database to store and retrieve data. Start the MongoDB service using the following command (for Linux):

```bash
systemctl start mongod
```
### Configuration
Update the following files to configure the backend according to your requirements:


In the root directory of the mental_health_analysis_backend, you will find a `.env` file. Open this file and update the following variable if needed: `QUESTION_COUNT`. Specify the number of questions each user should be asked in a single session. The default value is 10. If nothing is specified, all the questions will be asked.


In the `src/api/v1/utils/data` directory, you will find the `questionData.ts` and `taskData.ts` files. Open these files and update the questions and tasks respectively if needed.

### Running the Backend
Navigate to the root directory of the mental_health_analysis_backend project and run the following command to install the required dependencies:

```bash
yarn install
```
Once the installation is complete, start the backend server using the following command:

```bash
yarn start
```
This will start the backend server, and it will be ready to handle API requests from the frontend apps.

## Support and Contact
If you encounter any issues or have any questions regarding the mental_health_analysis_backend or the Mental Health Analysis system, please feel free to contact us or open an issue in the respective GitHub repositories.

We appreciate your interest and contribution to the Mental Health Analysis system!