CREATE TABLE Users(
    Username VARCHAR(255) PRIMARY KEY,
    Name VARCHAR(255) NOT NULL,
    Email VARCHAR(255) UNIQUE NOT NULL,
    Phone VARCHAR(20) UNIQUE NOT NULL,
    Address TEXT,
    City VARCHAR(100) NOT NULL,
    Password TEXT NOT NULL
);

ALTER TABLE Users
ADD COLUMN State VARCHAR(100) NOT NULL DEFAULT 'Unknown';


CREATE TABLE PetType (
    PetTypeID SERIAL PRIMARY KEY,
    PetTypeName VARCHAR(100) UNIQUE NOT NULL
);



CREATE TABLE Breed(
    BreedID SERIAL PRIMARY KEY,
    BreedName VARCHAR(255) NOT NULL UNIQUE,
	AverageLifespan INT CHECK (AverageLifespan > 0),
    PetTypeID INT REFERENCES PetType(PetTypeID) ON DELETE CASCADE
);

CREATE TABLE Pet (
    PetID SERIAL PRIMARY KEY,
    PetTypeID INT REFERENCES PetType(PetTypeID) ON DELETE CASCADE,
    Gender VARCHAR(10) CHECK (Gender IN ('Male', 'Female')),
    Age INT CHECK (Age >= 0),
    BreedID INT REFERENCES Breed(BreedID) ON DELETE CASCADE,
    Owner VARCHAR(255) REFERENCES Users(Username) ON DELETE SET NULL
);

CREATE TABLE Vet (
    VetID SERIAL PRIMARY KEY,
    Name VARCHAR(255) NOT NULL,
    ContactNumber VARCHAR(20) UNIQUE NOT NULL,
    Address TEXT NOT NULL,
    City VARCHAR(100) NOT NULL,
    Rating DECIMAL(2,1) CHECK (Rating BETWEEN 0 AND 5) DEFAULT 0,
    OpeningTime TIME NOT NULL,
    ClosingTime TIME NOT NULL
);
ALTER TABLE Vet
ADD COLUMN State VARCHAR(100) NOT NULL DEFAULT 'Unknown';


CREATE TABLE Store (
    StoreID SERIAL PRIMARY KEY,
    Name VARCHAR(255) NOT NULL UNIQUE,
    Address TEXT NOT NULL,
    ContactNumber VARCHAR(20) UNIQUE NOT NULL,
    City VARCHAR(100) NOT NULL
	
);
ALTER TABLE Store
ADD COLUMN State VARCHAR(100) NOT NULL DEFAULT 'Unknown';




CREATE TABLE Availability (
    StoreID INT REFERENCES Store(StoreID) ON DELETE CASCADE,
    BreedID INT REFERENCES Breed(BreedID) ON DELETE CASCADE,
    Available INT CHECK (Available >= 0) DEFAULT 0,
    PRIMARY KEY (StoreID, BreedID)
);

CREATE TABLE Adoption (
    Username VARCHAR(255) REFERENCES Users(Username) ON DELETE SET NULL,
    PetID INT REFERENCES Pet(PetID) ON DELETE CASCADE,
    AdoptDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (Username, PetID)
);






CREATE TABLE ShoppingCategory (
    CategoryID SERIAL PRIMARY KEY,
    CategoryName VARCHAR(100) NOT NULL UNIQUE
);



CREATE TABLE Product (
    ProductID SERIAL PRIMARY KEY,
    Name VARCHAR(255) NOT NULL UNIQUE,
    CategoryID INT REFERENCES ShoppingCategory(CategoryID) ON DELETE CASCADE,
    PetTypeID INT REFERENCES PetType(PetTypeID) ON DELETE CASCADE,
    Price DECIMAL(10,2) CHECK (Price > 0) NOT NULL
);


CREATE TABLE Supplies (
    StoreID INT REFERENCES Store(StoreID) ON DELETE CASCADE,
    ProductID INT REFERENCES Product(ProductID) ON DELETE CASCADE,
    Quantity INT CHECK (Quantity >= 0) DEFAULT 0,
    PRIMARY KEY (StoreID, ProductID)
);

CREATE TABLE Cart (
    CartID SERIAL PRIMARY KEY,
    Username VARCHAR(255) REFERENCES Users(Username) ON DELETE CASCADE,
    ProductID INT REFERENCES Product(ProductID) ON DELETE CASCADE,
    Quantity INT CHECK (Quantity > 0) NOT NULL
);

CREATE TABLE Orders (
    OrderID SERIAL PRIMARY KEY,
    Username VARCHAR(255) REFERENCES Users(Username) ON DELETE CASCADE,
    StoreID INT REFERENCES Store(StoreID) ON DELETE CASCADE,
    OrderDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	Status VARCHAR(20) CHECK (Status IN ('Pending', 'Shipped', 'Delivered', 'Cancelled')) DEFAULT 'Pending'
);

CREATE TABLE OrderDetails (
    OrderID INT REFERENCES Orders(OrderID) ON DELETE CASCADE,
    ProductID INT REFERENCES Product(ProductID) ON DELETE CASCADE,
    Quantity INT CHECK (Quantity > 0) NOT NULL,
    PRIMARY KEY (OrderID, ProductID)
);


INSERT INTO Users (Username, Name, Email, Phone, Address, City, Password) VALUES
('user1', 'Aisha Sharma', 'aisha.sharma@example.com', '+919876543210', '123 MG Road', 'Bangalore', 'password123'),
('user2', 'Rahul Verma', 'rahul.verma@example.com', '+919987654321', '456 Linking Road', 'Mumbai', 'securepass'),
('user3', 'Priya Patel', 'priya.patel@example.com', '+919765432109', '789 Park Street', 'Kolkata', 'complexpwd'),
('user4', 'Vikram Singh', 'vikram.singh@example.com', '+919654321098', '101 Anna Salai', 'Chennai', 'strongpw'),
('user5', 'Sneha Nair', 'sneha.nair@example.com', '+919543210987', '222 Brigade Road', 'Bangalore', 'p@sswOrd'),
('user6', 'Arjun Kumar', 'arjun.kumar@example.com', '+919432109876', '333 Connaught Place', 'Delhi', '123Secure'),
('user7', 'Deepika Rao', 'deepika.rao@example.com', '+919321098765', '444 Church Street', 'Mumbai', 'Passw0rd!'),
('user8', 'Suresh Reddy', 'suresh.reddy@example.com', '+919210987654', '555 MG Road', 'Hyderabad', 'Qwerty123'),
('user9', 'Meera Menon', 'meera.menon@example.com', '+919109876543', '666 Park Street', 'Pune', 'MySecret'),
('user10', 'Ganesh Iyer', 'ganesh.iyer@example.com', '+919098765432', '777 Anna Salai', 'Chennai', 'TopSecret'),
('user11', 'Kavita Joshi', 'kavita.joshi@example.com', '+918987654321', '888 Linking Road', 'Ahmedabad', '123456'),
('user12', 'Ramesh Sharma', 'ramesh.sharma@example.com', '+918876543210', '999 Brigade Road', 'Jaipur', 'Abcdefg'),
('user13', 'Anita Verma', 'anita.verma@example.com', '+918765432109', '1001 Connaught Place', 'Delhi', 'Password'),
('user14', 'Rajesh Patel', 'rajesh.patel@example.com', '+918654321098', '1002 Church Street', 'Hyderabad', 'MyPassword'),
('user15', 'Shalini Singh', 'shalini.singh@example.com', '+918543210987', '1003 MG Road', 'Kolkata', 'SecurePass'),
('user16', 'Mahesh Nair', 'mahesh.nair@example.com', '+918432109876', '1004 Park Street', 'Chandigarh', 'StrongPwd'),
('user17', 'Divya Kumar', 'divya.kumar@example.com', '+918321098765', '1005 Anna Salai', 'Mumbai', 'P@ssword'),
('user18', 'Prakash Rao', 'prakash.rao@example.com', '+918210987654', '1006 Linking Road', 'Bangalore', '123Secure'),
('user19', 'Lakshmi Reddy', 'lakshmi.reddy@example.com', '+918109876543', '1007 Brigade Road', 'Pune', 'Passw0rd!'),
('user20', 'Kiran Menon', 'kiran.menon@example.com', '+918098765432', '1008 Connaught Place', 'Chennai', 'Qwerty123'),
('user21', 'Sarita Iyer', 'sarita.iyer@example.com', '+917987654321', '1009 Church Street', 'Delhi', 'MySecret'),
('user22', 'Sunil Joshi', 'sunil.joshi@example.com', '+917876543210', '1010 MG Road', 'Ahmedabad', 'TopSecret'),
('user23', 'Reena Sharma', 'reena.sharma@example.com', '+917765432109', '1011 Park Street', 'Jaipur', '123456'),
('user24', 'Anil Verma', 'anil.verma@example.com', '+917654321098', '1012 Anna Salai', 'Hyderabad', 'Abcdefg'),
('user25', 'Seema Patel', 'seema.patel@example.com', '+917543210987', '1013 Linking Road', 'Kolkata', 'Password'),
('user26', 'Rajiv Singh', 'rajiv.singh@example.com', '+917432109876', '1014 Brigade Road', 'Chandigarh', 'MyPassword'),
('user27', 'Maya Nair', 'maya.nair@example.com', '+917321098765', '1015 Connaught Place', 'Mumbai', 'SecurePass'),
('user28', 'Vikram Kumar', 'vikram.kumar@example.com', '+917210987654', '1016 Church Street', 'Bangalore', 'StrongPwd'),
('user29', 'Pooja Rao', 'pooja.rao@example.com', '+917109876543', '1017 MG Road', 'Pune', 'P@ssword'),
('user30', 'Sandeep Reddy', 'sandeep.reddy@example.com', '+917098765432', '1018 Park Street', 'Chennai', '123Secure'),
('user31', 'Neha Menon', 'neha.menon@example.com', '+916987654321', '1019 Anna Salai', 'Delhi', 'Passw0rd!'),
('user32', 'Srinivas Iyer', 'srinivas.iyer@example.com', '+916876543210', '1020 Linking Road', 'Ahmedabad', 'Qwerty123'),
('user33', 'Anjali Joshi', 'anjali.joshi@example.com', '+916765432109', '1021 Brigade Road', 'Jaipur', 'MySecret'),
('user34', 'Deepak Sharma', 'deepak.sharma@example.com', '+916654321098', '1022 Connaught Place', 'Hyderabad', 'TopSecret'),
('user35', 'Karishma Verma', 'karishma.verma@example.com', '+916543210987', '1023 Church Street', 'Kolkata', '123456'),
('user36', 'Tarun Patel', 'tarun.patel@example.com', '+916432109876', '1024 MG Road', 'Chandigarh', 'Abcdefg'),
('user37', 'Vidya Singh', 'vidya.singh@example.com', '+916321098765', '1025 Park Street', 'Mumbai', 'Password'),
('user38', 'Amit Nair', 'amit.nair@example.com', '+916210987654', '1026 Anna Salai', 'Bangalore', 'MyPassword'),
('user39', 'Radha Kumar', 'radha.kumar@example.com', '+916109876543', '1027 Linking Road', 'Pune', 'SecurePass'),
('user40', 'Mohan Rao', 'mohan.rao@example.com', '+916098765432', '1028 Brigade Road', 'Chennai', 'StrongPwd'),
('user41', 'Shilpa Reddy', 'shilpa.reddy@example.com', '+915987654321', '1029 Connaught Place', 'Delhi', 'P@ssword'),
('user42', 'Gopal Menon', 'gopal.menon@example.com', '+915876543210', '1030 Church Street', 'Ahmedabad', '123Secure'),
('user43', 'Geetha Iyer', 'geetha.iyer@example.com', '+915765432109', '1031 MG Road', 'Jaipur', 'Passw0rd!'),
('user44', 'Bhavna Joshi', 'bhavna.joshi@example.com', '+915654321098', '1032 Park Street', 'Hyderabad', 'Qwerty123'),
('user45', 'Hemant Sharma', 'hemant.sharma@example.com', '+915543210987', '1033 Anna Salai', 'Kolkata', 'MySecret'),
('user46', 'Jyoti Verma', 'jyoti.verma@example.com', '+915432109876', '1034 Linking Road', 'Chandigarh', 'TopSecret'),
('user47', 'Kiran Patel', 'kiran.patel@example.com', '+915321098765', '1035 Brigade Road', 'Mumbai', '123456'),
('user48', 'Lata Singh', 'lata.singh@example.com', '+915210987654', '1036 Connaught Place', 'Bangalore', 'Abcdefg'),
('user49', 'Manoj Nair', 'manoj.nair@example.com', '+915109876543', '1037 Church Street', 'Pune', 'Password'),
('user50', 'Nina Kumar', 'nina.kumar@example.com', '+915098765432', '1038 MG Road', 'Chennai', 'MyPassword'),
('user51', 'Om Rao', 'om.rao@example.com', '+914987654321', '1039 Park Street', 'Delhi', 'SecurePass'),
('user52', 'Parvati Reddy', 'parvati.reddy@example.com', '+914876543210', '1040 Anna Salai', 'Ahmedabad', 'StrongPwd'),
('user53', 'Rajesh Menon', 'rajesh.menon@example.com', '+914765432109', '1041 Linking Road', 'Jaipur', 'P@ssword'),
('user54', 'Saloni Iyer', 'saloni.iyer@example.com', '+914654321098', '1042 Brigade Road', 'Hyderabad', '123Secure'),
('user55', 'Tanmay Joshi', 'tanmay.joshi@example.com', '+914543210987', '1043 Connaught Place', 'Kolkata', 'Passw0rd!'),
('user56', 'Uma Sharma', 'uma.sharma@example.com', '+914432109876', '1044 Church Street', 'Chandigarh', 'Qwerty123'),
('user57', 'Vikrant Verma', 'vikrant.verma@example.com', '+914321098765', '1045 MG Road', 'Mumbai', 'MySecret'),
('user58', 'Winnie Patel', 'winnie.patel@example.com', '+914210987654', '1046 Park Street', 'Bangalore', 'TopSecret'),
('user59', 'Yash Singh', 'yash.singh@example.com', '+914109876543', '1047 Anna Salai', 'Pune', '123456'),
('user60', 'Zoya Nair', 'zoya.nair@example.com', '+914098765432', '1048 Linking Road', 'Chennai', 'Abcdefg'),
('user61', 'Aryan Kumar', 'aryan.kumar@example.com', '+913987654321', '1049 Brigade Road', 'Delhi', 'Password'),
('user62', 'Bhumika Rao', 'bhumika.rao@example.com', '+913876543210', '1050 Connaught Place', 'Ahmedabad', 'MyPassword'),
('user63', 'Chirag Reddy', 'chirag.reddy@example.com', '+913765432109', '1051 Church Street', 'Jaipur', 'SecurePass'),
('user64', 'Dimple Menon', 'dimple.menon@example.com', '+913654321098', '1052 MG Road', 'Hyderabad', 'StrongPwd'),
('user65', 'Ekta Iyer', 'ekta.iyer@example.com', '+913543210987', '1053 Park Street', 'Kolkata', 'P@ssword'),
('user66', 'Faisal Joshi', 'faisal.joshi@example.com', '+913432109876', '1054 Anna Salai', 'Chandigarh', '123Secure'),
('user67', 'Gayatri Sharma', 'gayatri.sharma@example.com', '+913321098765', '1055 Linking Road', 'Mumbai', 'Passw0rd!'),
('user68', 'Harsh Verma', 'harsh.verma@example.com', '+913210987654', '1056 Brigade Road', 'Bangalore', 'Qwerty123'),
('user69', 'Ishika Patel', 'ishika.patel@example.com', '+913109876543', '1057 Connaught Place', 'Pune', 'MySecret'),
('user70', 'Jai Singh', 'jai.singh@example.com', '+913098765432', '1058 Church Street', 'Chennai', 'TopSecret'),
('user71', 'Kirti Nair', 'kirti.nair@example.com', '+912987654321', '1059 MG Road', 'Delhi', '123456'),
('user72', 'Lalit Kumar', 'lalit.kumar@example.com', '+912876543210', '1060 Park Street', 'Ahmedabad', 'Abcdefg'),
('user73', 'Madhu Rao', 'madhu.rao@example.com', '+912765432109', '1061 Anna Salai', 'Jaipur', 'Password'),
('user74', 'Nisha Reddy', 'nisha.reddy@example.com', '+912654321098', '1062 Linking Road', 'Hyderabad', 'MyPassword'),
('user75', 'Ojas Menon', 'ojas.menon@example.com', '+912543210987', '1063 Brigade Road', 'Kolkata', 'SecurePass'),
('user76', 'Parul Iyer', 'parul.iyer@example.com', '+912432109876', '1064 Connaught Place', 'Chandigarh', 'StrongPwd'),
('user77', 'Rohan Joshi', 'rohan.joshi@example.com', '+912321098765', '1065 Church Street', 'Mumbai', 'P@ssword'),
('user78', 'Siya Sharma', 'siya.sharma@example.com', '+912210987654', '1066 MG Road', 'Bangalore', '123Secure'),
('user79', 'Tushar Verma', 'tushar.verma@example.com', '+912109876543', '1067 Park Street', 'Pune', 'Passw0rd!'),
('user80', 'Urvi Patel', 'urvi.patel@example.com', '+912098765432', '1068 Anna Salai', 'Chennai', 'Qwerty123'),
('user81', 'Varun Singh', 'varun.singh@example.com', '+911987654321', '1069 Linking Road', 'Delhi', 'MySecret'),
('user82', 'Yana Nair', 'yana.nair@example.com', '+911876543210', '1070 Brigade Road', 'Ahmedabad', 'TopSecret'),
('user83', 'Zara Kumar', 'zara.kumar@example.com', '+911765432109', '1071 Connaught Place', 'Jaipur', '123456'),
('user84', 'Abhay Rao', 'abhay.rao@example.com', '+911654321098', '1072 Church Street', 'Hyderabad', 'Abcdefg'),
('user85', 'Bhavya Reddy', 'bhavya.reddy@example.com', '+911543210987', '1073 MG Road', 'Kolkata', 'Password'),
('user86', 'Charu Menon', 'charu.menon@example.com', '+911432109876', '1074 Park Street', 'Chandigarh', 'MyPassword'),
('user87', 'Dev Iyer', 'dev.iyer@example.com', '+911321098765', '1075 Anna Salai', 'Mumbai', 'SecurePass'),
('user88', 'Esha Joshi', 'esha.joshi@example.com', '+911210987654', '1076 Linking Road', 'Bangalore', 'StrongPwd'),
('user89', 'Farhan Sharma', 'farhan.sharma@example.com', '+911109876543', '1077 Brigade Road', 'Pune', 'P@ssword'),
('user90', 'Gauri Verma', 'gauri.verma@example.com', '+911098765432', '1078 Connaught Place', 'Chennai', '123Secure'),
('user91', 'Harit Patel', 'harit.patel@example.com', '+910987654321', '1079 Church Street', 'Delhi', 'Passw0rd!'),
('user92', 'Isha Singh', 'isha.singh@example.com', '+910876543210', '1080 MG Road', 'Ahmedabad', 'Qwerty123'),
('user93', 'Jatin Nair', 'jatin.nair@example.com', '+910765432109', '1081 Park Street', 'Jaipur', 'MySecret'),
('user94', 'Kajal Kumar', 'kajal.kumar@example.com', '+910654321098', '1082 Anna Salai', 'Hyderabad', 'TopSecret'),
('user95', 'Lucky Rao', 'lucky.rao@example.com', '+910543210987', '1083 Linking Road', 'Kolkata', '123456'),
('user96', 'Mona Reddy', 'mona.reddy@example.com', '+910432109876', '1084 Brigade Road', 'Chandigarh', 'Abcdefg'),
('user97', 'Navin Menon', 'navin.menon@example.com', '+910321098765', '1085 Connaught Place', 'Mumbai', 'Password'),
('user98', 'Oshin Iyer', 'oshin.iyer@example.com', '+910210987654', '1086 Church Street', 'Bangalore', 'MyPassword'),
('user99', 'Priti Joshi', 'priti.joshi@example.com', '+910109876543', '1087 MG Road', 'Pune', 'SecurePass'),
('user100', 'Ravi Sharma', 'ravi.sharma@example.com', '+910098765432', '1088 Park Street', 'Chennai', 'StrongPwd');

UPDATE Users SET State = 'Karnataka' WHERE Username = 'user1';
UPDATE Users SET State = 'Maharashtra' WHERE Username = 'user2';
UPDATE Users SET State = 'West Bengal' WHERE Username = 'user3';
UPDATE Users SET State = 'Tamil Nadu' WHERE Username = 'user4';
UPDATE Users SET State = 'Karnataka' WHERE Username = 'user5';
UPDATE Users SET State = 'Delhi' WHERE Username = 'user6';
UPDATE Users SET State = 'Maharashtra' WHERE Username = 'user7';
UPDATE Users SET State = 'Telangana' WHERE Username = 'user8';
UPDATE Users SET State = 'Maharashtra' WHERE Username = 'user9';
UPDATE Users SET State = 'Tamil Nadu' WHERE Username = 'user10';
UPDATE Users SET State = 'Gujarat' WHERE Username = 'user11';
UPDATE Users SET State = 'Rajasthan' WHERE Username = 'user12';
UPDATE Users SET State = 'Delhi' WHERE Username = 'user13';
UPDATE Users SET State = 'Telangana' WHERE Username = 'user14';
UPDATE Users SET State = 'West Bengal' WHERE Username = 'user15';
UPDATE Users SET State = 'Punjab' WHERE Username = 'user16';
UPDATE Users SET State = 'Maharashtra' WHERE Username = 'user17';
UPDATE Users SET State = 'Karnataka' WHERE Username = 'user18';
UPDATE Users SET State = 'Maharashtra' WHERE Username = 'user19';
UPDATE Users SET State = 'Tamil Nadu' WHERE Username = 'user20';
UPDATE Users SET State = 'Delhi' WHERE Username = 'user21';
UPDATE Users SET State = 'Gujarat' WHERE Username = 'user22';
UPDATE Users SET State = 'Rajasthan' WHERE Username = 'user23';
UPDATE Users SET State = 'Telangana' WHERE Username = 'user24';
UPDATE Users SET State = 'West Bengal' WHERE Username = 'user25';
UPDATE Users SET State = 'Punjab' WHERE Username = 'user26';
UPDATE Users SET State = 'Maharashtra' WHERE Username = 'user27';
UPDATE Users SET State = 'Karnataka' WHERE Username = 'user28';
UPDATE Users SET State = 'Maharashtra' WHERE Username = 'user29';
UPDATE Users SET State = 'Tamil Nadu' WHERE Username = 'user30';
UPDATE Users SET State = 'Delhi' WHERE Username = 'user31';
UPDATE Users SET State = 'Gujarat' WHERE Username = 'user32';
UPDATE Users SET State = 'Rajasthan' WHERE Username = 'user33';
UPDATE Users SET State = 'Telangana' WHERE Username = 'user34';
UPDATE Users SET State = 'West Bengal' WHERE Username = 'user35';
UPDATE Users SET State = 'Punjab' WHERE Username = 'user36';
UPDATE Users SET State = 'Maharashtra' WHERE Username = 'user37';
UPDATE Users SET State = 'Karnataka' WHERE Username = 'user38';
UPDATE Users SET State = 'Maharashtra' WHERE Username = 'user39';
UPDATE Users SET State = 'Tamil Nadu' WHERE Username = 'user40';
UPDATE Users SET State = 'Delhi' WHERE Username = 'user41';
UPDATE Users SET State = 'Gujarat' WHERE Username = 'user42';
UPDATE Users SET State = 'Rajasthan' WHERE Username = 'user43';
UPDATE Users SET State = 'Telangana' WHERE Username = 'user44';
UPDATE Users SET State = 'West Bengal' WHERE Username = 'user45';
UPDATE Users SET State = 'Punjab' WHERE Username = 'user46';
UPDATE Users SET State = 'Maharashtra' WHERE Username = 'user47';
UPDATE Users SET State = 'Karnataka' WHERE Username = 'user48';
UPDATE Users SET State = 'Maharashtra' WHERE Username = 'user49';
UPDATE Users SET State = 'Tamil Nadu' WHERE Username = 'user50';
UPDATE Users SET State = 'Delhi' WHERE Username = 'user51';
UPDATE Users SET State = 'Gujarat' WHERE Username = 'user52';
UPDATE Users SET State = 'Rajasthan' WHERE Username = 'user53';
UPDATE Users SET State = 'Telangana' WHERE Username = 'user54';
UPDATE Users SET State = 'West Bengal' WHERE Username = 'user55';
UPDATE Users SET State = 'Punjab' WHERE Username = 'user56';
UPDATE Users SET State = 'Maharashtra' WHERE Username = 'user57';
UPDATE Users SET State = 'Karnataka' WHERE Username = 'user58';
UPDATE Users SET State = 'Maharashtra' WHERE Username = 'user59';
UPDATE Users SET State = 'Tamil Nadu' WHERE Username = 'user60';
UPDATE Users SET State = 'Delhi' WHERE Username = 'user61';
UPDATE Users SET State = 'Gujarat' WHERE Username = 'user62';
UPDATE Users SET State = 'Rajasthan' WHERE Username = 'user63';
UPDATE Users SET State = 'Telangana' WHERE Username = 'user64';
UPDATE Users SET State = 'West Bengal' WHERE Username = 'user65';
UPDATE Users SET State = 'Punjab' WHERE Username = 'user66';
UPDATE Users SET State = 'Maharashtra' WHERE Username = 'user67';
UPDATE Users SET State = 'Karnataka' WHERE Username = 'user68';
UPDATE Users SET State = 'Maharashtra' WHERE Username = 'user69';
UPDATE Users SET State = 'Tamil Nadu' WHERE Username = 'user70';
UPDATE Users SET State = 'Delhi' WHERE Username = 'user71';
UPDATE Users SET State = 'Gujarat' WHERE Username = 'user72';
UPDATE Users SET State = 'Rajasthan' WHERE Username = 'user73';
UPDATE Users SET State = 'Telangana' WHERE Username = 'user74';
UPDATE Users SET State = 'West Bengal' WHERE Username = 'user75';
UPDATE Users SET State = 'Punjab' WHERE Username = 'user76';
UPDATE Users SET State = 'Maharashtra' WHERE Username = 'user77';
UPDATE Users SET State = 'Karnataka' WHERE Username = 'user78';
UPDATE Users SET State = 'Maharashtra' WHERE Username = 'user79';
UPDATE Users SET State = 'Tamil Nadu' WHERE Username = 'user80';
UPDATE Users SET State = 'Delhi' WHERE Username = 'user81';
UPDATE Users SET State = 'Gujarat' WHERE Username = 'user82';
UPDATE Users SET State = 'Rajasthan' WHERE Username = 'user83';
UPDATE Users SET State = 'Telangana' WHERE Username = 'user84';
UPDATE Users SET State = 'West Bengal' WHERE Username = 'user85';
UPDATE Users SET State = 'Punjab' WHERE Username = 'user86';
UPDATE Users SET State = 'Maharashtra' WHERE Username = 'user87';
UPDATE Users SET State = 'Karnataka' WHERE Username = 'user88';
UPDATE Users SET State = 'Maharashtra' WHERE Username = 'user89';
UPDATE Users SET State = 'Tamil Nadu' WHERE Username = 'user90';
UPDATE Users SET State = 'Delhi' WHERE Username = 'user91';
UPDATE Users SET State = 'Gujarat' WHERE Username = 'user92';
UPDATE Users SET State = 'Rajasthan' WHERE Username = 'user93';
UPDATE Users SET State = 'Telangana' WHERE Username = 'user94';
UPDATE Users SET State = 'West Bengal' WHERE Username = 'user95';
UPDATE Users SET State = 'Punjab' WHERE Username = 'user96';
UPDATE Users SET State = 'Maharashtra' WHERE Username = 'user97';
UPDATE Users SET State = 'Karnataka' WHERE Username = 'user98';
UPDATE Users SET State = 'Maharashtra' WHERE Username = 'user99';
UPDATE Users SET State = 'Tamil Nadu' WHERE Username = 'user100';

SELECT * FROM Users;




INSERT INTO PetType (PetTypeName) VALUES
('Dog'),
('Cat'),
('Fish'),
('Bird');





INSERT INTO Breed (BreedName, AverageLifespan, PetTypeID) VALUES
('Labrador Retriever', 12, 1),
('Golden Retriever', 12, 1),
('German Shepherd', 11, 1),
('Bulldog', 10, 1),
('Poodle', 14, 1),
('Beagle', 15, 1),
('Dachshund', 14, 1),
('Siberian Husky', 13, 1),
('Boxer', 10, 1),
('Shih Tzu', 14, 1),
('Pug', 13, 1),
('Rottweiler', 10, 1),
('Doberman Pinscher', 11, 1),
('Great Dane', 9, 1),
('Chihuahua', 17, 1),
('Border Collie', 14, 1),
('Basset Hound', 12, 1),
('Maltese', 15, 1),
('Akita', 13, 1),
('Cocker Spaniel', 13, 1),
('Saint Bernard', 9, 1),
('Samoyed', 14, 1),
('Dalmatian', 13, 1),
('Shiba Inu', 14, 1),
('Australian Shepherd', 15, 1),
('Persian Cat', 15, 2),
('Siamese Cat', 16, 2),
('Maine Coon', 14, 2),
('Bengal Cat', 15, 2),
('Ragdoll Cat', 15, 2),
('Scottish Fold', 13, 2),
('Sphynx', 12, 2),
('British Shorthair', 14, 2),
('Abyssinian', 15, 2),
('Birman', 16, 2),
('Oriental Shorthair', 14, 2),
('Norwegian Forest Cat', 15, 2),
('Turkish Angora', 14, 2),
('Himalayan', 15, 2),
('Devon Rex', 14, 2),
('Cornish Rex', 13, 2),
('Japanese Bobtail', 15, 2),
('American Shorthair', 15, 2),
('Balinese', 15, 2),
('Tonkinese', 14, 2),
('Burmese', 16, 2),
('Russian Blue', 15, 2),
('Singapura', 14, 2),
('Turkish Van', 15, 2),
('LaPerm', 14, 2),
('Goldfish', 10, 3),
('Betta Fish', 3, 3),
('Koi Fish', 40, 3),
('Guppy', 3, 3),
('Molly Fish', 5, 3),
('Neon Tetra', 8, 3),
('Angelfish', 10, 3),
('Oscar Fish', 15, 3),
('Clownfish', 6, 3),
('Discus', 10, 3),
('Corydoras Catfish', 7, 3),
('Platy Fish', 5, 3),
('Swordtail Fish', 5, 3),
('Zebra Danio', 5, 3),
('Rainbowfish', 8, 3),
('Electric Blue Acara', 10, 3),
('Flowerhorn Cichlid', 10, 3),
('Pearl Gourami', 5, 3),
('Tiger Barb', 7, 3),
('Cherry Barb', 6, 3),
('Rosy Barb', 8, 3),
('Silver Dollar Fish', 10, 3),
('Arowana', 20, 3),
('Piranha', 10, 3),
('Firemouth Cichlid', 8, 3),
('Parrot', 50, 4),
('Canary', 10, 4),
('Cockatoo', 40, 4),
('Macaw', 50, 4),
('Finch', 7, 4),
('Lovebird', 15, 4),
('Budgerigar', 10, 4),
('African Grey Parrot', 60, 4),
('Amazon Parrot', 50, 4),
('Conure', 30, 4),
('Cockatiel', 25, 4),
('Dove', 15, 4),
('Mynah', 12, 4),
('Pigeon', 10, 4),
('Quaker Parrot', 25, 4),
('Lorikeet', 20, 4),
('Rosella', 15, 4),
('Senegal Parrot', 30, 4),
('Tanager', 8, 4),
('Starling', 10, 4),
('Sparrow', 5, 4),
('Magpie', 25, 4),
('Falcon', 15, 4),
('Hawk', 20, 4),
('Owl', 30, 4);




INSERT INTO Pet (PetTypeID, Gender, Age, BreedID, Owner) VALUES
(1, 'Male', 3, 1, 'user1'),
(1, 'Female', 2, 2, 'user2'),
(1, 'Male', 5, 3, 'user3'),
(1, 'Female', 1, 4, 'user4'),
(1, 'Male', 4, 5, 'user5'),
(2, 'Female', 3, 26, 'user6'),
(2, 'Male', 2, 27, 'user7'),
(2, 'Female', 4, 28, 'user8'),
(2, 'Male', 1, 32, 'user9'),
(2, 'Female', 5, 29, 'user10'),
(3, 'Male', 1, 51, 'user11'),
(3, 'Female', 2, 52, 'user12'),
(3, 'Male', 3, 54, 'user13'),
(3, 'Female', 1, 57, 'user14'),
(3, 'Male', 2, 55, 'user15'),
(4, 'Female', 2, 82, 'user16'),
(1, 'Female', 3, 5, 'user17'),
(2, 'Male', 2, 32, 'user18'),
(3, 'Female', 1, 57, 'user19'),
(4, 'Male', 3, 83, 'user20'),
(1, 'Male', 3, 1, 'user21'),
(1, 'Female', 2, 2, 'user22'),
(1, 'Male', 5, 3, 'user23'),
(1, 'Female', 1, 4, 'user24'),
(1, 'Male', 4, 5, 'user25'),
(4, 'Female', 2, 82, 'user26'),
(1, 'Female', 3, 5, 'user27'),
(2, 'Male', 2, 32, 'user28'),
(3, 'Female', 1, 57, 'user29'),
(4, 'Male', 3, 83, 'user30'),
(1, 'Male', 1, 2, 'user101'), (1, 'Female', 2, 3, 'user102'), -- Pets for Store 6
(2, 'Male', 1, 4, 'user103'), (2, 'Female', 2, 2,  'user4'), -- Pets for Store 7
(3, 'Male', 1, 1, 'user2'), (3, 'Female',2, 5, 'user99'), -- Pets for Store 8
(4, 'Male',1,  6, 'user1'), (4, 'Female',2,  3, 'user4'), -- Pets for Store 9
(2, 'Male',1,  2, 'user3'), (2, 'Female',2,  4, 'user2'); -- Pets for Store 10




INSERT INTO Vet (Name, ContactNumber, Address, City, Rating, OpeningTime, ClosingTime) VALUES
('Dr. Rajesh Sharma', '+919876543210', '123 MG Road', 'Bangalore', 4.5, '09:00', '18:00'),
('Dr. Priya Verma', '+919987654321', '456 Linking Road', 'Mumbai', 4.2, '10:00', '19:00'),
('Dr. Vikram Patel', '+919765432109', '789 Park Street', 'Kolkata', 4.8, '08:00', '17:00'),
('Dr. Sneha Singh', '+919654321098', '101 Anna Salai', 'Chennai', 4.0, '09:30', '18:30'),
('Dr. Arjun Kumar', '+919543210987', '222 Brigade Road', 'Bangalore', 4.6, '10:30', '19:30'),
('Dr. Deepika Rao', '+919432109876', '333 Connaught Place', 'Delhi', 4.3, '08:30', '17:30'),
('Dr. Suresh Reddy', '+919321098765', '444 Church Street', 'Mumbai', 4.7, '09:15', '18:15'),
('Dr. Meera Menon', '+919210987654', '555 MG Road', 'Hyderabad', 4.1, '10:15', '19:15'),
('Dr. Ganesh Iyer', '+919109876543', '666 Park Street', 'Kochi', 4.9, '08:45', '17:45'),
('Dr. Kavita Joshi', '+919098765432', '777 Anna Salai', 'Chennai', 4.4, '09:45', '18:45'),
('Dr. Ramesh Sharma', '+918987654321', '888 Linking Road', 'Ahmedabad', 4.5, '10:00', '20:00'),
('Dr. Anita Verma', '+918876543210', '999 Brigade Road', 'Jaipur', 4.2, '09:30', '19:30'),
('Dr. Rajesh Patel', '+918765432109', '1001 Connaught Place', 'Lucknow', 4.8, '10:30', '20:30'),
('Dr. Shalini Singh', '+918654321098', '1002 Church Street', 'Pune', 4.0, '09:00', '19:00'),
('Dr. Mahesh Nair', '+918543210987', '1003 MG Road', 'Hyderabad', 4.6, '10:00', '20:00'),
('Dr. Divya Kumar', '+918432109876', '1004 Park Street', 'Kochi', 4.3, '09:30', '19:30'),
('Dr. Prakash Rao', '+918321098765', '1005 Anna Salai', 'Guwahati', 4.7, '10:30', '20:30'),
('Dr. Lakshmi Reddy', '+918210987654', '1006 Linking Road', 'Bhubaneswar', 4.1, '09:00', '19:00'),
('Dr. Kiran Menon', '+918109876543', '1007 Brigade Road', 'Chandigarh', 4.9, '10:00', '20:00'),
('Dr. Sarita Iyer', '+918098765432', '1008 Connaught Place', 'Srinagar', 4.4, '09:30', '19:30'),
('Dr. Sunil Joshi', '+917987654321', '1009 Church Street', 'Panaji', 4.5, '10:00', '20:00'),
('Dr. Reena Sharma', '+917876543210', '1010 MG Road', 'Shimla', 4.2, '09:30', '19:30'),
('Dr. Anil Verma', '+917765432109', '1011 Park Street', 'Ranchi', 4.8, '10:30', '20:30'),
('Dr. Seema Patel', '+917654321098', '1012 Anna Salai', 'Patna', 4.0, '09:00', '19:00'),
('Dr. Rajiv Singh', '+917543210987', '1013 Linking Road', 'Imphal', 4.6, '10:00', '20:00'),
('Dr. Maya Nair', '+917432109876', '1014 Brigade Road', 'Shillong', 4.3, '09:30', '19:30'),
('Dr. Vikram Kumar', '+917321098765', '1015 Connaught Place', 'Aizawl', 4.7, '10:30', '20:30'),
('Dr. Pooja Rao', '+917210987654', '1016 Church Street', 'Kohima', 4.1, '09:00', '19:00'),
('Dr. Sandeep Reddy', '+917109876543', '1017 MG Road', 'Agartala', 4.9, '10:00', '20:00'),
('Dr. Neha Menon', '+917098765432', '1018 Park Street', 'Dehradun', 4.4, '09:30', '19:30'),
('Dr. Srinivas Iyer', '+916987654321', '1019 Anna Salai', 'Raipur', 4.5, '10:00', '20:00'),
('Dr. Anjali Joshi', '+916876543210', '1020 Linking Road', 'Bhopal', 4.2, '09:30', '19:30'),
('Dr. Deepak Sharma', '+916765432109', '1021 Brigade Road', 'Itanagar', 4.8, '10:30', '20:30'),
('Dr. Karishma Verma', '+916654321098', '1022 Connaught Place', 'Amaravati', 4.0, '09:00', '19:00'),
('Dr. Tarun Patel', '+916543210987', '1023 Church Street', 'Thiruvananthapuram', 4.6, '10:00', '20:00'),
('Dr. Vidya Singh', '+916432109876', '1024 MG Road', 'Panaji', 4.3, '09:30', '19:30'),
('Dr. Amit Nair', '+916321098765', '1025 Park Street', 'Puducherry', 4.7, '10:30', '20:30'),
('Dr. Radha Kumar', '+916210987654', '1026 Anna Salai', 'Gangtok', 4.1, '09:00', '19:00'),
('Dr. Mohan Rao', '+916109876543', '1027 Linking Road', 'Daman', 4.9, '10:00', '20:00'),
('Dr. Shilpa Reddy', '+916098765432', '1028 Brigade Road', 'Kavaratti', 4.4, '09:30', '19:30'),
('Dr. Gopal Menon', '+915987654321', '1029 Connaught Place', 'Port Blair', 4.5, '10:00', '20:00'),
('Dr. Geetha Iyer', '+915876543210', '1030 Church Street', 'Bilaspur', 4.2, '09:30', '19:30'),
('Dr. Bhavna Joshi', '+915765432109', '1031 MG Road', 'Visakhapatnam', 4.8, '10:30', '20:30'),
('Dr. Hemant Sharma', '+915654321098', '1032 Park Street', 'Guwahati', 4.0, '09:00', '19:00'),
('Dr. Jyoti Verma', '+915543210987', '1033 Anna Salai', 'Aurangabad', 4.6, '10:00', '20:00'),
('Dr. Kiran Patel', '+915432109876', '1034 Linking Road', 'Indore', 4.3, '09:30', '19:30'),
('Dr. Lata Singh', '+915321098765', '1035 Brigade Road', 'Mysuru', 4.7, '10:30', '20:30'),
('Dr. Manoj Nair', '+915210987654', '1036 Connaught Place', 'Kozhikode', 4.1, '09:00', '19:00'),
('Dr. Nina Kumar', '+915109876543', '1037 Church Street', 'Vadodara', 4.9, '10:00', '20:00'),
('Dr. Om Rao', '+915098765432', '1038 MG Road', 'Ludhiana', 4.4, '09:30', '19:30'),
('Dr. Parvati Reddy', '+914987654321', '1039 Park Street', 'Udaipur', 4.5, '10:00', '20:00'),
('Dr. Rajesh Menon', '+914876543210', '1040 Anna Salai', 'Varanasi', 4.2, '09:30', '19:30'),
('Dr. Saloni Iyer', '+914765432109', '1041 Linking Road', 'Madurai', 4.8, '10:30', '20:30'),
('Dr. Tanmay Joshi', '+914654321098', '1042 Brigade Road', 'Nashik', 4.0, '09:00', '19:00'),
('Dr. Uma Sharma', '+914543210987', '1043 Connaught Place', 'Kanpur', 4.6, '10:00', '20:00'),
('Dr. Vikrant Verma', '+914432109876', '1044 Church Street', 'Nagpur', 4.3, '09:30', '19:30'),
('Dr. Winnie Patel', '+914321098765', '1045 MG Road', 'Bhubaneswar', 4.7, '10:30', '20:30'),
('Dr. Yash Singh', '+914210987654', '1046 Park Street', 'Dehradun', 4.1, '09:00', '19:00'),
('Dr. Zoya Nair', '+914109876543', '1047 Anna Salai', 'Jodhpur', 4.9, '10:00', '20:00'),
('Dr. Aryan Kumar', '+914098765432', '1048 Linking Road', 'Amritsar', 4.4, '09:30', '19:30'),
('Dr. Bhumika Rao', '+913987654321', '1049 Brigade Road', 'Thane', 4.5, '10:00', '20:00'),
('Dr. Chirag Reddy', '+913876543210', '1050 Connaught Place', 'Coimbatore', 4.2, '09:30', '19:30'),
('Dr. Dimple Menon', '+913765432109', '1051 Church Street', 'Allahabad', 4.8, '10:30', '20:30'),
('Dr. Ekta Iyer', '+913654321098', '1052 MG Road', 'Gwalior', 4.0, '09:00', '19:00'),
('Dr. Faisal Joshi', '+913543210987', '1053 Park Street', 'Vijayawada', 4.6, '10:00', '20:00'),
('Dr. Gayatri Sharma', '+913432109876', '1054 Anna Salai', 'Meerut', 4.3, '09:30', '19:30'),
('Dr. Harsh Verma', '+913321098765', '1055 Linking Road', 'Raipur', 4.7, '10:30', '20:30'),
('Dr. Ishika Patel', '+913210987654', '1056 Brigade Road', 'Kolhapur', 4.1, '09:00', '19:00'),
('Dr. Jai Singh', '+913109876543', '1057 Connaught Place', 'Ajmer', 4.9, '10:00', '20:00'),
('Dr. Kirti Nair', '+913098765432', '1058 Church Street', 'Agra', 4.4, '09:30', '19:30'),
('Dr. Lalit Kumar', '+912987654321', '1059 MG Road', 'Thrissur', 4.5, '10:00', '20:00'),
('Dr. Madhu Rao', '+912876543210', '1060 Park Street', 'Jalandhar', 4.2, '09:30', '19:30'),
('Dr. Nisha Reddy', '+912765432109', '1061 Anna Salai', 'Jamnagar', 4.8, '10:30', '20:30'),
('Dr. Ojas Menon', '+912654321098', '1062 Linking Road', 'Warangal', 4.0, '09:00', '19:00'),
('Dr. Parul Iyer', '+912543210987', '1063 Brigade Road', 'Dhanbad', 4.6, '10:00', '20:00'),
('Dr. Rohan Joshi', '+912432109876', '1064 Connaught Place', 'Bikaner', 4.3, '09:30', '19:30'),
('Dr. Siya Sharma', '+912321098765', '1065 Church Street', 'Bhavnagar', 4.7, '10:30', '20:30'),
('Dr. Tushar Verma', '+912210987654', '1066 MG Road', 'Bareilly', 4.1, '09:00', '19:00'),
('Dr. Urvi Patel', '+912109876543', '1067 Park Street', 'Aligarh', 4.9, '10:00', '20:00'),
('Dr. Varun Singh', '+912098765432', '1068 Anna Salai', 'Rourkela', 4.4, '09:30', '19:30'),
('Dr. Yana Nair', '+911987654321', '1069 Linking Road', 'Kurnool', 4.5, '10:00', '20:00'),
('Dr. Zara Kumar', '+911876543210', '1070 Brigade Road', 'Bokaro', 4.2, '09:30', '19:30'),
('Dr. Abhay Rao', '+911765432109', '1071 Connaught Place', 'Durgapur', 4.8, '10:30', '20:30'),
('Dr. Bhavya Reddy', '+911654321098', '1072 Church Street', 'Asansol', 4.0, '09:00', '19:00'),
('Dr. Charu Menon', '+911543210987', '1073 MG Road', 'Bellary', 4.6, '10:00', '20:00'),
('Dr. Dev Iyer', '+911432109876', '1074 Park Street', 'Gulbarga', 4.3, '09:30', '19:30'),
('Dr. Esha Joshi', '+911321098765', '1075 Anna Salai', 'Tiruchirappalli', 4.7, '10:30', '20:30'),
('Dr. Farhan Sharma', '+911210987654', '1076 Linking Road', 'Nellore', 4.1, '09:00', '19:00'),
('Dr. Gauri Verma', '+911109876543', '1077 Brigade Road', 'Jammu', 4.9, '10:00', '20:00'),
('Dr. Harit Patel', '+911098765432', '1078 Connaught Place', 'Saharanpur', 4.4, '09:30', '19:30'),
('Dr. Isha Singh', '+910987654321', '1079 Church Street', 'Loni', 4.5, '10:00', '20:00'),
('Dr. Jatin Nair', '+910876543210', '1080 MG Road', 'Siliguri', 4.2, '09:30', '19:30'),
('Dr. Kajal Kumar', '+910765432109', '1081 Park Street', 'Gaya', 4.8, '10:30', '20:30'),
('Dr. Lucky Rao', '+910654321098', '1082 Anna Salai', 'Gorakhpur', 4.0, '09:00', '19:00'),
('Dr. Mona Reddy', '+910543210987', '1083 Linking Road', 'Bhilai', 4.6, '10:00', '20:00'),
('Dr. Navin Menon', '+910432109876', '1084 Brigade Road', 'Cuttack', 4.3, '09:30', '19:30'),
('Dr. Oshin Iyer', '+910321098765', '1085 Connaught Place', 'Firozabad', 4.7, '10:30', '20:30'),
('Dr. Priti Joshi', '+910210987654', '1086 Church Street', 'Muzaffarpur', 4.1, '09:00', '19:00'),
('Dr. Ravi Sharma', '+910109876543', '1087 MG Road', 'Kochi', 4.9, '10:00', '20:00'),
('Dr. Sunita Devi', '+910098765432', '1088 Park Street', 'Patiala', 4.4, '09:30', '19:30');


UPDATE Vet SET State = 'Karnataka' WHERE City = 'Bangalore';
UPDATE Vet SET State = 'Maharashtra' WHERE City = 'Mumbai';
UPDATE Vet SET State = 'West Bengal' WHERE City = 'Kolkata';
UPDATE Vet SET State = 'Tamil Nadu' WHERE City = 'Chennai';
UPDATE Vet SET State = 'Delhi' WHERE City = 'Delhi';
UPDATE Vet SET State = 'Telangana' WHERE City = 'Hyderabad';
UPDATE Vet SET State = 'Kerala' WHERE City = 'Kochi';
UPDATE Vet SET State = 'Gujarat' WHERE City = 'Ahmedabad';
UPDATE Vet SET State = 'Rajasthan' WHERE City = 'Jaipur';
UPDATE Vet SET State = 'Uttar Pradesh' WHERE City = 'Lucknow';
UPDATE Vet SET State = 'Maharashtra' WHERE City = 'Pune';
UPDATE Vet SET State = 'Assam' WHERE City = 'Guwahati';
UPDATE Vet SET State = 'Odisha' WHERE City = 'Bhubaneswar';
UPDATE Vet SET State = 'Punjab' WHERE City = 'Chandigarh';
UPDATE Vet SET State = 'Jammu and Kashmir' WHERE City = 'Srinagar';
UPDATE Vet SET State = 'Goa' WHERE City = 'Panaji';
UPDATE Vet SET State = 'Himachal Pradesh' WHERE City = 'Shimla';
UPDATE Vet SET State = 'Jharkhand' WHERE City = 'Ranchi';
UPDATE Vet SET State = 'Bihar' WHERE City = 'Patna';
UPDATE Vet SET State = 'Manipur' WHERE City = 'Imphal';
UPDATE Vet SET State = 'Meghalaya' WHERE City = 'Shillong';
UPDATE Vet SET State = 'Mizoram' WHERE City = 'Aizawl';
UPDATE Vet SET State = 'Nagaland' WHERE City = 'Kohima';
UPDATE Vet SET State = 'Tripura' WHERE City = 'Agartala';
UPDATE Vet SET State = 'Uttarakhand' WHERE City = 'Dehradun';
UPDATE Vet SET State = 'Chhattisgarh' WHERE City = 'Raipur';
UPDATE Vet SET State = 'Madhya Pradesh' WHERE City = 'Bhopal';
UPDATE Vet SET State = 'Arunachal Pradesh' WHERE City = 'Itanagar';
UPDATE Vet SET State = 'Andhra Pradesh' WHERE City = 'Amaravati';
UPDATE Vet SET State = 'Kerala' WHERE City = 'Thiruvananthapuram';
UPDATE Vet SET State = 'Puducherry' WHERE City = 'Puducherry';
UPDATE Vet SET State = 'Sikkim' WHERE City = 'Gangtok';
UPDATE Vet SET State = 'Daman and Diu' WHERE City = 'Daman';
UPDATE Vet SET State = 'Lakshadweep' WHERE City = 'Kavaratti';
UPDATE Vet SET State = 'Andaman and Nicobar Islands' WHERE City = 'Port Blair';
UPDATE Vet SET State = 'Chhattisgarh' WHERE City = 'Bilaspur';
UPDATE Vet SET State = 'Andhra Pradesh' WHERE City = 'Visakhapatnam';
UPDATE Vet SET State = 'Maharashtra' WHERE City = 'Aurangabad';
UPDATE Vet SET State = 'Madhya Pradesh' WHERE City = 'Indore';
UPDATE Vet SET State = 'Karnataka' WHERE City = 'Mysuru';
UPDATE Vet SET State = 'Kerala' WHERE City = 'Kozhikode';
UPDATE Vet SET State = 'Gujarat' WHERE City = 'Vadodara';
UPDATE Vet SET State = 'Punjab' WHERE City = 'Ludhiana';
UPDATE Vet SET State = 'Rajasthan' WHERE City = 'Udaipur';
UPDATE Vet SET State = 'Uttar Pradesh' WHERE City = 'Varanasi';
UPDATE Vet SET State = 'Tamil Nadu' WHERE City = 'Madurai';
UPDATE Vet SET State = 'Maharashtra' WHERE City = 'Nashik';
UPDATE Vet SET State = 'Uttar Pradesh' WHERE City = 'Kanpur';
UPDATE Vet SET State = 'Maharashtra' WHERE City = 'Nagpur';
UPDATE Vet SET State = 'Rajasthan' WHERE City = 'Jodhpur';
UPDATE Vet SET State = 'Punjab' WHERE City = 'Amritsar';
UPDATE Vet SET State = 'Maharashtra' WHERE City = 'Thane';
UPDATE Vet SET State = 'Tamil Nadu' WHERE City = 'Coimbatore';
UPDATE Vet SET State = 'Uttar Pradesh' WHERE City = 'Allahabad';
UPDATE Vet SET State = 'Madhya Pradesh' WHERE City = 'Gwalior';
UPDATE Vet SET State = 'Andhra Pradesh' WHERE City = 'Vijayawada';
UPDATE Vet SET State = 'Uttar Pradesh' WHERE City = 'Meerut';
UPDATE Vet SET State = 'Maharashtra' WHERE City = 'Kolhapur';
UPDATE Vet SET State = 'Rajasthan' WHERE City = 'Ajmer';
UPDATE Vet SET State = 'Uttar Pradesh' WHERE City = 'Agra';
UPDATE Vet SET State = 'Kerala' WHERE City = 'Thrissur';
UPDATE Vet SET State = 'Punjab' WHERE City = 'Jalandhar';
UPDATE Vet SET State = 'Gujarat' WHERE City = 'Jamnagar';
UPDATE Vet SET State = 'Telangana' WHERE City = 'Warangal';
UPDATE Vet SET State = 'Jharkhand' WHERE City = 'Dhanbad';
UPDATE Vet SET State = 'Rajasthan' WHERE City = 'Bikaner';
UPDATE Vet SET State = 'Gujarat' WHERE City = 'Bhavnagar';
UPDATE Vet SET State = 'Uttar Pradesh' WHERE City = 'Bareilly';
UPDATE Vet SET State = 'Uttar Pradesh' WHERE City = 'Aligarh';
UPDATE Vet SET State = 'Odisha' WHERE City = 'Rourkela';
UPDATE Vet SET State = 'Andhra Pradesh' WHERE City = 'Kurnool';
UPDATE Vet SET State = 'Jharkhand' WHERE City = 'Bokaro';
UPDATE Vet SET State = 'West Bengal' WHERE City = 'Durgapur';
UPDATE Vet SET State = 'West Bengal' WHERE City = 'Asansol';
UPDATE Vet SET State = 'Karnataka' WHERE City = 'Bellary';
UPDATE Vet SET State = 'Karnataka' WHERE City = 'Gulbarga';
UPDATE Vet SET State = 'Tamil Nadu' WHERE City = 'Tiruchirappalli';
UPDATE Vet SET State = 'Andhra Pradesh' WHERE City = 'Nellore';
UPDATE Vet SET State = 'Jammu and Kashmir' WHERE City = 'Jammu';
UPDATE Vet SET State = 'Uttar Pradesh' WHERE City = 'Saharanpur';
UPDATE Vet SET State = 'Uttar Pradesh' WHERE City = 'Loni';
UPDATE Vet SET State = 'West Bengal' WHERE City = 'Siliguri';
UPDATE Vet SET State = 'Bihar' WHERE City = 'Gaya';
UPDATE Vet SET State = 'Uttar Pradesh' WHERE City = 'Gorakhpur';
UPDATE Vet SET State = 'Chhattisgarh' WHERE City = 'Bhilai';
UPDATE Vet SET State = 'Odisha' WHERE City = 'Cuttack';
UPDATE Vet SET State = 'Uttar Pradesh' WHERE City = 'Firozabad';
UPDATE Vet SET State = 'Bihar' WHERE City = 'Muzaffarpur';
UPDATE Vet SET State = 'Punjab' WHERE City = 'Patiala';





INSERT INTO Store (Name, Address, ContactNumber, City) VALUES
('Paws & Claws', '123 MG Road, Indiranagar', '9876543201', 'Bangalore'),
('Happy Paws', '123 FC Road, Deccan', '9876543233', 'Pune'),
('Pet & Co.', '22 Andheri West, Lokhandwala', '9876543255', 'Mumbai'),
('City Pets', '101 Bandra, Linking Road', '9876543257', 'Delhi'),
('Meow Mart', '89 Baisakhi, Sector 3', '9876543263', 'Kolkata'),
('The Pet Emporium', '67 Anna Nagar', '9876543267', 'Chennai'),
('Furball Hub', '21 Banjara Hills', '9876543271', 'Hyderabad'),
('Pawfect Care', '12 CG Road, Navrangpura', '9876543273', 'Ahmedabad'),
('Critter Corner', '88 Sector 17', '9876543270', 'Chandigarh'),
('Furry Haven', '22 Raja Park', '9876543277', 'Jaipur');



UPDATE Store SET State = 'Karnataka' WHERE City = 'Bangalore';
UPDATE Store SET State = 'Maharashtra' WHERE City = 'Pune';
UPDATE Store SET State = 'Maharashtra' WHERE City = 'Mumbai';
UPDATE Store SET State = 'Delhi' WHERE City = 'Delhi';
UPDATE Store SET State = 'West Bengal' WHERE City = 'Kolkata';
UPDATE Store SET State = 'Tamil Nadu' WHERE City = 'Chennai';
UPDATE Store SET State = 'Telangana' WHERE City = 'Hyderabad';
UPDATE Store SET State = 'Gujarat' WHERE City = 'Ahmedabad';
UPDATE Store SET State = 'Chandigarh' WHERE City = 'Chandigarh';
UPDATE Store SET State = 'Rajasthan' WHERE City = 'Jaipur';







INSERT INTO Availability (StoreID, BreedID, Available) VALUES
(1, 1, 5),
(1, 2, 3),
(1, 3, 7),
(1, 4, 2),
(1, 5, 6),
(1, 6, 1),
(1, 7, 4),
(1, 8, 5),
(1, 9, 8),
(1, 10, 3),
(2, 1, 6),
(2, 2, 8),
(2, 3, 4),
(2, 4, 5),
(2, 5, 2),
(2, 6, 7),
(2, 7, 3),
(2, 8, 6),
(2, 9, 5),
(2, 10, 7),
(3, 1, 8),
(3, 2, 6),
(3, 3, 2),
(3, 4, 5),
(3, 5, 9),
(3, 6, 1),
(3, 7, 3),
(3, 8, 4),
(3, 9, 6),
(3, 10, 5),
(4, 1, 7),
(4, 2, 2),
(4, 3, 6),
(4, 4, 5),
(4, 5, 3),
(4, 6, 4),
(4, 7, 5),
(4, 8, 7),
(4, 9, 2),
(4, 10, 8),
(5, 1, 4),
(5, 2, 5),
(5, 3, 6),
(5, 4, 3),
(5, 5, 7),
(5, 6, 8),
(5, 7, 2),
(5, 8, 5),
(5, 9, 9),
(5, 10, 1),
(6, 11, 6),
(6, 12, 3),
(6, 13, 7),
(6, 14, 2),
(6, 15, 6),
(6, 16, 1),
(6, 17, 4),
(6, 18, 5),
(6, 19, 8),
(6, 20, 3),
(7, 11, 6),
(7, 12, 8),
(7, 13, 4),
(7, 14, 5),
(7, 15, 2),
(7, 16, 7),
(7, 17, 3),
(7, 18, 6),
(7, 19, 5),
(7, 20, 7),
(8, 11, 8),
(8, 12, 6),
(8, 13, 2),
(8, 14, 5),
(8, 15, 9),
(8, 16, 1),
(8, 17, 3),
(8, 18, 4),
(8, 19, 6),
(8, 20, 5),
(9, 11, 7),
(9, 12, 2),
(9, 13, 6),
(9, 14, 5),
(9, 15, 3),
(9, 16, 4),
(9, 17, 5),
(9, 18, 7),
(9, 19, 2),
(9, 20, 8),
(10, 11, 4),
(10, 12, 5),
(10, 13, 6),
(10, 14, 3),
(10, 15, 7),
(10, 16, 8),
(10, 17, 2),
(10, 18, 5),
(10, 19, 9),
(10, 20, 1),
(6, 1, 10), (6, 2, 5), (7, 3, 8), (7, 4, 6), 
(8, 2, 7), (8, 3, 9), (9, 1, 4), (9, 4, 5), 
(10, 3, 3), (10, 2, 6),
-- Adding availability for the first 3 cat breeds
(1, 26, 7), -- Persian Cat at store 1
(2, 26, 5), -- Persian Cat at store 2
(3, 26, 6), -- Persian Cat at store 3
(4, 26, 8), -- Persian Cat at store 4
(5, 26, 4), -- Persian Cat at store 5
(1, 27, 6), -- Siamese Cat at store 1
(2, 27, 8), -- Siamese Cat at store 2
(3, 27, 4), -- Siamese Cat at store 3
(4, 27, 5), -- Siamese Cat at store 4
(1, 28, 5), -- Maine Coon at store 1
(3, 28, 7), -- Maine Coon at store 3
(5, 28, 6), -- Maine Coon at store 5
(6, 28, 4); -- Maine Coon at store 6





INSERT INTO Adoption (Username, PetID, AdoptDate) VALUES
('user1', '161', '2023-07-01 10:30:00'),
('user2', '162', '2023-07-02 14:45:00'),
('user3', '163', '2023-07-03 11:00:00'),
('user4', '164', '2023-07-04 09:20:00'),
('user5', '161', '2023-07-05 16:10:00'),
('user6', '162', '2023-07-06 12:40:00'),
('user7', '163', '2023-07-07 08:15:00'),
('user8', '164', '2023-07-08 15:30:00'),
('user9', '161', '2023-07-09 17:25:00'),
('user10', '162', '2023-07-10 13:10:00'),
('user11', '163', '2023-07-11 11:00:00'),
('user12', '164', '2023-07-12 14:00:00'),
('user13', '161', '2023-07-13 10:30:00'),
('user14', '162', '2023-07-14 15:20:00'),
('user15', '163', '2023-07-15 16:40:00'),
('user16', '164', '2023-07-16 09:00:00'),
('user17', '161', '2023-07-17 12:15:00'),
('user18', '162', '2023-07-18 13:40:00'),
('user19', '163', '2023-07-19 10:10:00'),
('user20', '164', '2023-07-20 15:50:00'),
('user21', '161', '2023-07-21 11:00:00'),
('user22', '162', '2023-07-22 14:30:00'),
('user23', '163', '2023-07-23 09:40:00'),
('user24', '164', '2023-07-24 17:20:00'),
('user25', '161', '2023-07-25 12:50:00'),
('user26', '162', '2023-07-26 10:30:00'),
('user27', '163', '2023-07-27 15:45:00'),
('user28', '164', '2023-07-28 13:10:00'),
('user29', '161', '2023-07-29 11:20:00'),
('user30', '162', '2023-07-30 16:10:00'),
('user31', '163', '2023-07-31 14:00:00'),
('user32', '164', '2023-08-01 09:30:00'),
('user33', '161', '2023-08-02 17:40:00'),
('user34', '162', '2023-08-03 13:30:00'),
('user35', '163', '2023-08-04 12:10:00'),
('user36', '164', '2023-08-05 15:20:00'),
('user37', '161', '2023-08-06 11:00:00'),
('user38', '162', '2023-08-07 14:50:00'),
('user39', '163', '2023-08-08 10:40:00'),
('user40', '164', '2023-08-09 16:30:00'),
('user41', '161', '2023-08-10 12:20:00'),
('user42', '162', '2023-08-11 15:00:00'),
('user43', '163', '2023-08-12 09:10:00'),
('user44', '164', '2023-08-13 17:50:00'),
('user45', '161', '2023-08-14 13:40:00'),
('user46', '162', '2023-08-15 12:30:00'),
('user47', '163', '2023-08-16 15:50:00'),
('user48', '164', '2023-08-17 11:10:00'),
('user49', '161', '2023-08-18 16:40:00'),
('user50', '162', '2023-08-19 14:20:00'),
('user51', '163', '2023-08-20 10:30:00'),
('user52', '164', '2023-08-21 14:45:00'),
('user53', '161', '2023-08-22 11:00:00'),
('user54', '162', '2023-08-23 09:20:00'),
('user55', '163', '2023-08-24 16:10:00'),
('user56', '164', '2023-08-25 12:40:00'),
('user57', '161', '2023-08-26 08:15:00'),
('user58', '162', '2023-08-27 15:30:00'),
('user59', '163', '2023-08-28 17:25:00'),
('user60', '164', '2023-08-29 13:10:00'),
('user61', '161', '2023-08-30 11:00:00'),
('user62', '162', '2023-08-31 14:00:00'),
('user63', '163', '2023-09-01 10:30:00'),
('user64', '164', '2023-09-02 15:20:00'),
('user65', '161', '2023-09-03 16:40:00'),
('user66', '162', '2023-09-04 09:00:00'),
('user67', '163', '2023-09-05 12:15:00'),
('user68', '164', '2023-09-06 13:40:00'),
('user69', '161', '2023-09-07 10:10:00'),
('user70', '162', '2023-09-08 15:50:00'),
('user71', '163', '2023-09-09 11:00:00'),
('user72', '164', '2023-09-10 14:30:00'),
('user73', '161', '2023-09-11 17:20:00'),
('user74', '162', '2023-09-12 12:50:00'),
('user75', '163', '2023-09-13 10:30:00'),
('user76', '164', '2023-09-14 15:20:00'),
('user77', '161', '2023-09-15 16:40:00'),
('user78', '162', '2023-09-16 09:00:00'),
('user79', '163', '2023-09-17 12:15:00'),
('user80', '164', '2023-09-18 13:40:00'),
('user81', '161', '2023-09-19 10:10:00'),
('user82', '162', '2023-09-20 15:50:00'),
('user83', '163', '2023-09-21 11:00:00'),
('user84', '164', '2023-09-22 14:30:00'),
('user85', '161', '2023-09-23 17:20:00'),
('user86', '162', '2023-09-24 12:50:00'),
('user87', '163', '2023-09-25 10:30:00'),
('user88', '164', '2023-09-26 15:20:00'),
('user89', '161', '2023-09-27 16:40:00'),
('user90', '162', '2023-09-28 09:00:00'),
('user91', '163', '2023-09-29 12:15:00'),
('user92', '164', '2023-09-30 13:40:00'),
('user93', '161', '2023-10-01 10:45:00'),
('user94', '162', '2023-10-02 12:30:00'),
('user95', '163', '2023-10-03 15:10:00'),
('user96', '164', '2023-10-04 09:50:00'),
('user97', '161', '2023-10-05 14:20:00'),
('user98', '162', '2023-10-06 11:40:00'),
('user99', '163', '2023-10-07 16:35:00'),
('user100', '164', '2023-10-08 13:05:00'),
('user101', '164', '2024-03-01'),
('user102', '164', '2024-03-02'),
('user103', '161', '2024-03-03'),
('user104', '161', '2024-03-04'),
('user105', '162', '2024-03-05'),
('user106', '164', '2024-03-06'),
('user107', '164', '2024-03-07'),
('user5', '163', '2024-03-08'),
('user6', '163', '2024-03-09'),
('user7', '164', '2024-03-10');








INSERT INTO ShoppingCategory (CategoryName) VALUES
('Food & Treats'),
('Toys & Entertainment'),
('Grooming & Hygiene'),
('Health & Wellness'),
('Beds & Furniture'),
('Carriers & Travel'),
('Collars, Leashes & Harnesses'),
('Clothing & Accessories'),
('Feeding & Watering'),
('Training & Behavior'),
('Outdoor & Sports');





INSERT INTO Product (Name, CategoryID, PetTypeID, Price) VALUES
('Premium Dog Food - Chicken', 1, 1, 799.99),
('Grain-Free Dog Food', 1, 1, 899.99),
('Puppy Training Treats', 1, 1, 299.99),
('Dental Chew Sticks', 1, 1, 349.99),
('Squeaky Plush Toy', 2, 1, 499.99),
('Interactive Ball Launcher', 2, 1, 1199.99),
('Dog Shampoo - Anti-Flea', 3, 1, 599.99),
('Dog Nail Clipper', 3, 1, 249.99),
('Hip & Joint Supplements', 4, 1, 999.99),
('Digestive Health Probiotic', 4, 1, 699.99),
('Luxury Orthopedic Dog Bed', 5, 1, 2499.99),
('Portable Dog Crate', 6, 1, 3499.99),
('Leather Dog Collar', 7, 1, 699.99),
('Retractable Dog Leash', 7, 1, 1299.99),
('Anti-Pull Dog Harness', 7, 1, 1499.99),
('Travel Dog Carrier', 6, 1, 2999.99),
('Winter Dog Sweater', 8, 1, 999.99),
('Waterproof Dog Raincoat', 8, 1, 1299.99),
('Dog Food & Water Dispenser', 9, 1, 1599.99),
('Raised Dog Feeding Bowl', 9, 1, 699.99),
('Grain-Free Cat Food', 1, 2, 799.99),
('Canned Wet Cat Food', 1, 2, 699.99),
('Catnip Infused Treats', 1, 2, 249.99),
('Tuna Flavored Crunchy Treats', 1, 2, 299.99),
('Feather Teaser Wand', 2, 2, 349.99),
('Cat Scratching Post', 2, 2, 1199.99),
('Anti-Shedding Cat Shampoo', 3, 2, 549.99),
('Cat Claw Trimmer', 3, 2, 229.99),
('Multi-Vitamin for Cats', 4, 2, 899.99),
('Calming Cat Supplement', 4, 2, 699.99),
('Luxury Cat Tree & Condo', 5, 2, 4499.99),
('Cat Bed with Heating Pad', 5, 2, 2299.99),
('Soft Velvet Cat Collar', 7, 2, 599.99),
('Reflective Cat Harness', 7, 2, 1299.99),
('Retractable Cat Leash', 7, 2, 999.99),
('Portable Cat Carrier', 6, 2, 2499.99),
('Winter Cat Hoodie', 8, 2, 1099.99),
('Waterproof Cat Jacket', 8, 2, 1399.99),
('Smart Cat Feeder', 9, 2, 3999.99),
('Cat Drinking Fountain', 9, 2, 1299.99),
('Premium Parrot Food Mix', 1, 3, 499.99),
('Sunflower Seed Bird Treats', 1, 3, 199.99),
('Hanging Bird Toy Set', 2, 3, 599.99),
('Mirror & Bell Bird Toy', 2, 3, 349.99),
('Bird Feather Conditioning Spray', 3, 3, 399.99),
('Bird Perch - Natural Wood', 5, 3, 599.99),
('Large Bird Cage', 6, 3, 5999.99),
('Bird Travel Carrier', 6, 3, 1499.99),
('Bird Nesting Box', 8, 3, 699.99),
('Automatic Bird Water Feeder', 9, 3, 499.99),
('Premium Tropical Fish Food', 1, 4, 299.99),
('Algae Control Tablets', 4, 4, 399.99),
('Aquarium Gravel Cleaner', 3, 4, 999.99),
('Decorative Aquarium Plants', 2, 4, 599.99),
('LED Aquarium Light', 5, 4, 1999.99),
('Water Conditioner for Fish Tanks', 4, 4, 399.99),
('Glass Fish Bowl', 6, 4, 899.99),
('Aquarium Heater', 5, 4, 1499.99),
('Automatic Fish Feeder', 9, 4, 1299.99),
('Fish Tank Water Test Kit', 4, 4, 799.99);




INSERT INTO Supplies (StoreID, ProductID, Quantity) VALUES
(1, 1, 50), (1, 2, 30), (1, 3, 40), (1, 4, 20), (1, 5, 60),
(1, 16, 15), (1, 17, 40), (1, 18, 20), (1, 19, 10), (1, 20, 60),
(1, 31, 25), (1, 32, 30), (1, 33, 15), (1, 34, 45), (1, 35, 35),
(1, 46, 10), (1, 47, 40), (1, 48, 25), (1, 49, 20), (1, 50, 55),
(2, 6, 10), (2, 7, 35), (2, 8, 25), (2, 9, 15), (2, 10, 45), 
(2, 21, 25), (2, 22, 30), (2, 23, 15), (2, 24, 45), (2, 25, 35),  
(2, 36, 10), (2, 37, 40), (2, 38, 25), (2, 39, 20), (2, 40, 55), 
(2, 51, 30), (2, 52, 20), (2, 53, 25), (2, 54, 40), (2, 55, 15),  
(3, 11, 55), (3, 12, 20), (3, 13, 35), (3, 14, 30), (3, 15, 50),  
(3, 26, 10), (3, 27, 40), (3, 28, 25), (3, 29, 20), (3, 30, 55),  
(3, 41, 45), (3, 42, 30), (3, 43, 20), (3, 44, 25), (3, 45, 50),  
(3, 56, 10), (3, 57, 35), (3, 58, 40), (3, 59, 60), (3, 60, 15),  
(4, 1, 50), (4, 2, 30), (4, 3, 40), (4, 4, 20), (4, 5, 60),  
(4, 16, 15), (4, 17, 40), (4, 18, 20), (4, 19, 10), (4, 20, 60),  
(4, 31, 25), (4, 32, 30), (4, 33, 15), (4, 34, 45), (4, 35, 35),  
(4, 46, 10), (4, 47, 40), (4, 48, 25), (4, 49, 20), (4, 50, 55), 
(5, 6, 10), (5, 7, 35), (5, 8, 25), (5, 9, 15), (5, 10, 45),  
(5, 21, 25), (5, 22, 30), (5, 23, 15), (5, 24, 45), (5, 25, 35), 
(5, 36, 10), (5, 37, 40), (5, 38, 25), (5, 39, 20), (5, 40, 55), 
(5, 51, 30), (5, 52, 20), (5, 53, 25), (5, 54, 40), (5, 55, 15),  
(6, 11, 55), (6, 12, 20), (6, 13, 35), (6, 14, 30), (6, 15, 50),
(6, 26, 10), (6, 27, 40), (6, 28, 25), (6, 29, 20), (6, 30, 55), 
(6, 41, 45), (6, 42, 30), (6, 43, 20), (6, 44, 25), (6, 45, 50),
(6, 56, 10), (6, 57, 35), (6, 58, 40), (6, 59, 60), (6, 60, 15),
(7, 1, 50), (7, 2, 30), (7, 3, 40), (7, 4, 20), (7, 5, 60),
(7, 16, 15), (7, 17, 40), (7, 18, 20), (7, 19, 10), (7, 20, 60),
(7, 31, 25), (7, 32, 30), (7, 33, 15), (7, 34, 45), (7, 35, 35),
(7, 46, 10), (7, 47, 40), (7, 48, 25), (7, 49, 20), (7, 50, 55),
(8, 6, 10), (8, 7, 35), (8, 8, 25), (8, 9, 15), (8, 10, 45),  
(8, 21, 25), (8, 22, 30), (8, 23, 15), (8, 24, 45), (8, 25, 35),
(8, 36, 10), (8, 37, 40), (8, 38, 25), (8, 39, 20), (8, 40, 55), 
(8, 51, 30), (8, 52, 20), (8, 53, 25), (8, 54, 40), (8, 55, 15),
(9, 11, 55), (9, 12, 20), (9, 13, 35), (9, 14, 30), (9, 15, 50),  
(9, 26, 10), (9, 27, 40), (9, 28, 25), (9, 29, 20), (9, 30, 55),  
(9, 41, 45), (9, 42, 30), (9, 43, 20), (9, 44, 25), (9, 45, 50),  
(9, 56, 10), (9, 57, 35), (9, 58, 40), (9, 59, 60), (9, 60, 15),  
(10, 1, 50), (10, 2, 30), (10, 3, 40), (10, 4, 20), (10, 5, 60),  
(10, 16, 15), (10, 17, 40), (10, 18, 20), (10, 19, 10), (10, 20, 60),  
(10, 31, 25), (10, 32, 30), (10, 33, 15), (10, 34, 45), (10, 35, 35),  
(10, 46, 10), (10, 47, 40), (10, 48, 25), (10, 49, 20), (10, 50, 55); 



INSERT INTO Cart (Username, ProductID, Quantity) VALUES
('user1', 1, 2),
('user2', 3, 1),
('user3', 5, 4),
('user4', 7, 3),
('user5', 9, 2),
('user6', 11, 5),
('user7', 13, 1),
('user8', 15, 4),
('user9', 17, 3),
('user10', 19, 2),
('user11', 21, 5),
('user12', 23, 1),
('user13', 25, 4),
('user14', 27, 3),
('user15', 29, 2),
('user16', 31, 5),
('user17', 33, 1),
('user18', 35, 4),
('user19', 37, 3),
('user20', 39, 2),
('user21', 41, 5),
('user22', 43, 1),
('user23', 45, 4),
('user24', 47, 3),
('user25', 49, 2),
('user26', 51, 5),
('user27', 53, 1),
('user28', 55, 4),
('user29', 57, 3),
('user30', 59, 2),
('user31', 2, 5),
('user32', 4, 1),
('user33', 6, 4),
('user34', 8, 3),
('user35', 10, 2),
('user36', 12, 5),
('user37', 14, 1),
('user38', 16, 4),
('user39', 18, 3),
('user40', 20, 2),
('user41', 22, 5),
('user42', 24, 1),
('user43', 26, 4),
('user44', 28, 3),
('user45', 30, 2),
('user46', 32, 5),
('user47', 34, 1),
('user48', 36, 4),
('user49', 38, 3),
('user50', 40, 2),
('user51', 42, 5),
('user52', 44, 1),
('user53', 46, 4),
('user54', 48, 3),
('user55', 50, 2),
('user56', 52, 5),
('user57', 54, 1),
('user58', 56, 4),
('user59', 58, 3),
('user60', 60, 2),
('user61', 1, 5),
('user62', 3, 1),
('user63', 5, 4),
('user64', 7, 3),
('user65', 9, 2),
('user66', 11, 5),
('user67', 13, 1),
('user68', 15, 4),
('user69', 17, 3),
('user70', 19, 2),
('user71', 21, 5),
('user72', 23, 1),
('user73', 25, 4),
('user74', 27, 3),
('user75', 29, 2),
('user76', 31, 5),
('user77', 33, 1),
('user78', 35, 4),
('user79', 37, 3),
('user80', 39, 2),
('user81', 41, 5),
('user82', 43, 1),
('user83', 45, 4),
('user84', 47, 3),
('user85', 49, 2),
('user86', 51, 5),
('user87', 53, 1),
('user88', 55, 4),
('user89', 57, 3),
('user90', 59, 2),
('user91', 2, 5),
('user92', 4, 1),
('user93', 6, 4),
('user94', 8, 3),
('user95', 10, 2),
('user96', 12, 5),
('user97', 14, 1),
('user98', 16, 4),
('user99', 18, 3),
('user100', 20, 2);



INSERT INTO Orders (Username, StoreID, OrderDate, Status) VALUES
('user1', 1, '2024-02-01 10:30:00', 'Pending'),
('user2', 2, '2024-02-01 11:15:00', 'Shipped'),
('user3', 3, '2024-02-01 12:45:00', 'Delivered'),
('user4', 4, '2024-02-01 14:10:00', 'Cancelled'),
('user5', 5, '2024-02-02 09:00:00', 'Pending'),
('user6', 6, '2024-02-02 10:20:00', 'Shipped'),
('user7', 7, '2024-02-02 13:30:00', 'Delivered'),
('user8', 8, '2024-02-02 15:50:00', 'Cancelled'),
('user9', 9, '2024-02-03 08:10:00', 'Pending'),
('user10', 10, '2024-02-03 09:25:00', 'Shipped'),
('user11', 1, '2024-02-03 11:40:00', 'Delivered'),
('user12', 2, '2024-02-03 14:00:00', 'Cancelled'),
('user13', 3, '2024-02-04 10:10:00', 'Pending'),
('user14', 4, '2024-02-04 12:15:00', 'Shipped'),
('user15', 5, '2024-02-04 14:30:00', 'Delivered'),
('user16', 6, '2024-02-04 16:45:00', 'Cancelled'),
('user17', 7, '2024-02-05 09:20:00', 'Pending'),
('user18', 8, '2024-02-05 11:35:00', 'Shipped'),
('user19', 9, '2024-02-05 13:50:00', 'Delivered'),
('user20', 10, '2024-02-05 15:55:00', 'Cancelled'),
('user21', 1, '2024-02-06 08:45:00', 'Pending'),
('user22', 2, '2024-02-06 10:30:00', 'Shipped'),
('user23', 3, '2024-02-06 12:15:00', 'Delivered'),
('user24', 4, '2024-02-06 14:00:00', 'Cancelled'),
('user25', 5, '2024-02-07 09:30:00', 'Pending'),
('user26', 6, '2024-02-07 11:45:00', 'Shipped'),
('user27', 7, '2024-02-07 13:50:00', 'Delivered'),
('user28', 8, '2024-02-07 15:10:00', 'Cancelled'),
('user29', 9, '2024-02-08 08:20:00', 'Pending'),
('user30', 10, '2024-02-08 10:40:00', 'Shipped'),
('user31', 1, '2024-02-08 12:50:00', 'Delivered'),
('user32', 2, '2024-02-08 15:05:00', 'Cancelled'),
('user33', 3, '2024-02-09 09:10:00', 'Pending'),
('user34', 4, '2024-02-09 11:25:00', 'Shipped'),
('user35', 5, '2024-02-09 14:30:00', 'Delivered'),
('user36', 6, '2024-02-09 16:45:00', 'Cancelled'),
('user37', 7, '2024-02-10 09:50:00', 'Pending'),
('user38', 8, '2024-02-10 11:55:00', 'Shipped'),
('user39', 9, '2024-02-10 13:15:00', 'Delivered'),
('user40', 10, '2024-02-10 15:40:00', 'Cancelled'),
('user41', 1, '2024-02-11 08:30:00', 'Pending'),
('user42', 2, '2024-02-11 10:20:00', 'Shipped'),
('user43', 3, '2024-02-11 12:35:00', 'Delivered'),
('user44', 4, '2024-02-11 14:50:00', 'Cancelled'),
('user45', 5, '2024-02-12 09:40:00', 'Pending'),
('user46', 6, '2024-02-12 11:55:00', 'Shipped'),
('user47', 7, '2024-02-12 13:20:00', 'Delivered'),
('user48', 8, '2024-02-12 15:30:00', 'Cancelled'),
('user49', 9, '2024-02-13 08:10:00', 'Pending'),
('user50', 10, '2024-02-13 10:25:00', 'Shipped'),
('user51', 1, '2024-02-13 12:40:00', 'Delivered'),
('user52', 2, '2024-02-13 14:50:00', 'Cancelled'),
('user53', 3, '2024-02-14 09:30:00', 'Pending'),
('user54', 4, '2024-02-14 11:45:00', 'Shipped'),
('user55', 5, '2024-02-14 13:50:00', 'Delivered'),
('user56', 6, '2024-02-14 16:10:00', 'Cancelled'),
('user57', 7, '2024-02-15 09:20:00', 'Pending'),
('user58', 8, '2024-02-15 11:35:00', 'Shipped'),
('user59', 9, '2024-02-15 13:50:00', 'Delivered'),
('user60', 10, '2024-02-15 15:55:00', 'Cancelled'),
('user61', 1, '2024-02-16 08:45:00', 'Pending'),
('user62', 2, '2024-02-16 10:30:00', 'Shipped'),
('user63', 3, '2024-02-16 12:15:00', 'Delivered'),
('user64', 4, '2024-02-16 14:00:00', 'Cancelled'),
('user65', 5, '2024-02-17 09:30:00', 'Pending'),
('user66', 6, '2024-02-17 11:45:00', 'Shipped'),
('user67', 7, '2024-02-17 13:50:00', 'Delivered'),
('user68', 8, '2024-02-17 15:10:00', 'Cancelled'),
('user69', 9, '2024-02-18 08:20:00', 'Pending'),
('user70', 10, '2024-02-18 10:40:00', 'Shipped'),
('user71', 1, '2024-02-18 12:50:00', 'Delivered'),
('user72', 2, '2024-02-18 15:05:00', 'Cancelled'),
('user73', 3, '2024-02-19 09:10:00', 'Pending'),
('user74', 4, '2024-02-19 11:25:00', 'Shipped'),
('user75', 5, '2024-02-19 14:30:00', 'Delivered'),
('user76', 6, '2024-02-19 16:45:00', 'Cancelled'),
('user77', 7, '2024-02-20 09:50:00', 'Pending'),
('user78', 8, '2024-02-20 11:55:00', 'Shipped'),
('user79', 9, '2024-02-20 13:15:00', 'Delivered'),
('user80', 10, '2024-02-20 15:40:00', 'Cancelled'),
('user101', 1, '2024-02-01 10:30:00', 'Pending'),
('user102', 2, '2024-02-01 11:15:00', 'Shipped'),
('user103', 3, '2024-02-01 12:45:00', 'Delivered'),
('user104', 4, '2024-02-01 14:10:00', 'Cancelled'),
('user105', 5, '2024-02-02 09:00:00', 'Pending'),
('user5', 1, '2025-03-22 10:15:30', 'Pending'),
('user12', 1, '2025-03-22 11:45:10', 'Shipped'),
('user25', 1, '2025-03-22 12:30:45', 'Pending'),
('user30', 6, '2025-03-22 14:05:20', 'Cancelled'),
('user42', 6, '2025-03-22 15:20:35', 'Pending'),
('user56', 6, '2025-03-22 16:50:50', 'Delivered'), 
('user75', 2, '2025-03-22 17:25:15', 'Pending'),
('user88', 4, '2025-03-22 18:40:30', 'Shipped'),
('user95', 4, '2025-03-22 19:55:45', 'Pending'),
('user99', 4, '2025-03-22 21:10:55', 'Delivered');


INSERT INTO OrderDetails (OrderID, ProductID, Quantity) VALUES
(1, 5, 2),
(2, 12, 3),
(3, 8, 1),
(4, 22, 4),
(5, 15, 2),
(6, 30, 5),
(7, 7, 3),
(8, 18, 2),
(9, 10, 4),
(10, 25, 1),
(11, 11, 3),
(12, 35, 2),
(13, 40, 5),
(14, 50, 1),
(15, 6, 2),
(16, 29, 4),
(17, 3, 1),
(18, 14, 2),
(19, 27, 5),
(20, 41, 3),
(21, 9, 4),
(22, 20, 2),
(23, 33, 3),
(24, 44, 1),
(25, 13, 2),
(26, 38, 5),
(27, 48, 3),
(28, 55, 4),
(29, 60, 2),
(30, 16, 1),
(31, 21, 3),
(32, 36, 5),
(33, 42, 2),
(34, 51, 1),
(35, 17, 4),
(36, 28, 2),
(37, 31, 3),
(38, 47, 5),
(39, 58, 1),
(40, 19, 2),
(41, 24, 3),
(42, 34, 4),
(43, 43, 1),
(44, 54, 5),
(45, 4, 2),
(46, 23, 3),
(47, 32, 1),
(48, 49, 4),
(49, 57, 3),
(50, 1, 5),
(51, 2, 2),
(52, 26, 3),
(53, 37, 4),
(54, 52, 1),
(55, 45, 3),
(56, 46, 2),
(57, 56, 5),
(58, 39, 1),
(59, 59, 2),
(60, 53, 4),
(61, 11, 3),
(62, 14, 2),
(63, 22, 1),
(64, 27, 5),
(65, 33, 3),
(66, 41, 4),
(67, 44, 2),
(68, 50, 1),
(69, 55, 3),
(70, 6, 2),
(71, 9, 5),
(72, 12, 4),
(73, 15, 1),
(74, 18, 3),
(75, 20, 2),
(76, 31, 4),
(77, 42, 1),
(78, 48, 5),
(79, 51, 3),
(80, 60, 2);


INSERT INTO Users (Username, Name, Email, Phone, Address, City, Password, State) VALUES  
('user101', 'Simar Ahi', 'simar.ahi@example.com', '+911234567890', '12 Green Avenue', 'Pune', 'roh@npwd123', 'Maharashtra'),  
('user102', 'Tushita Kapoor', 'tushita.kapoor@example.com', '+911324567890', '34 Blue Street', 'Delhi', 'n3h@secure', 'Delhi'),  
('user103', 'Muskaan Gupta', 'muskan.gupta@example.com', '+911423456789', '56 Red Road', 'Chandigarh', 'kh@nn@123', 'Punjab'),  
('user104', 'Aanya Gupta', 'aanya.gupta@example.com', '+919876543214', '78 Yellow Lane', 'Jaipur', 's@ny@pass', 'Rajasthan'),  
('user105', 'Aanya Jain', 'aanya.jain@example.com', '+919876593214', '78 Yellow Lane', 'Udaipur', 'a@ny@pass', 'Rajasthan');


INSERT INTO Users VALUES('user106', 'Karuna Singh', 'karuna.s@example.com', '+9123000000023', NULL, 'Noida', 'karuna786**');
INSERT INTO Users VALUES('user107', 'Zoyaa Azmi', 'zoyaa@example.com', '+9123006700023', NULL, 'Noida', 'zoyaa123');

UPDATE Users
SET State = 'Uttar Pradesh'
WHERE Users.username IN ('user107', 'user106');





