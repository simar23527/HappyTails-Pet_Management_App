-- Total and Average revenue per store
SELECT s.Name AS StoreName, 
       SUM(p.Price * od.Quantity) AS TotalRevenue, 
       AVG(p.Price * od.Quantity) AS AverageRevenue
FROM Orders o
JOIN OrderDetails od ON o.OrderID = od.OrderID
JOIN Product p ON od.ProductID = p.ProductID
JOIN Store s ON o.StoreID = s.StoreID
GROUP BY s.Name
ORDER BY TotalRevenue DESC;


-- Average price of product per category
SELECT sc.CategoryName, AVG(p.Price) AS AveragePrice
FROM Product p
JOIN ShoppingCategory sc ON p.CategoryID = sc.CategoryID
GROUP BY sc.CategoryName
ORDER BY AveragePrice DESC;


-- Most expensive product in each shopping category
SELECT P.Name AS ProductName, P.Price, SC.CategoryName
FROM Product P
JOIN ShoppingCategory SC ON P.CategoryID = SC.CategoryID
WHERE P.Price = (SELECT MAX(P2.Price) FROM Product P2 WHERE P2.CategoryID = P.CategoryID);


-- Stores with maximum orders
SELECT StoreID, COUNT(OrderID) AS OrderCount
FROM Orders
GROUP BY StoreID
HAVING COUNT(OrderID) = (
    SELECT MAX(OrderCount) FROM (
        SELECT COUNT(OrderID) AS OrderCount FROM Orders GROUP BY StoreID
    ) AS SubQuery
);


-- Users who have placed orders but never adopted a pet
SELECT U.Username, U.Name 
FROM Users U
WHERE U.Username IN (SELECT Username FROM Orders)
AND U.Username NOT IN (SELECT Username FROM Adoption);


-- Get products available in specific stores 
SELECT S.Name AS StoreName, P.Name AS ProductName, Su.Quantity
FROM Supplies Su
JOIN Store S ON Su.StoreID = S.StoreID
JOIN Product P ON Su.ProductID = P.ProductID
WHERE S.Name = 'Happy Paws';


-- Count number of pets by breed 
SELECT B.BreedName, COUNT(P.PetID) AS TotalPets
FROM Pet P
JOIN Breed B ON P.BreedID = B.BreedID
GROUP BY B.BreedName
ORDER BY TotalPets DESC;


-- Average number of pets adopted from a store 
SELECT adoption_counts.StoreID, AVG(adoption_counts.adopted_count) AS avg_pets_adopted
FROM (
    SELECT Av.StoreID, COUNT(*) AS adopted_count
    FROM Adoption Ad
    JOIN Pet P ON Ad.PetID = P.PetID
    JOIN Availability Av ON P.BreedID = Av.BreedID  
    GROUP BY Av.StoreID
) AS adoption_counts
GROUP BY adoption_counts.StoreID;


-- Get the most active adoption days(Peak days), for top 5 days 
SELECT DATE(AdoptDate) AS AdoptionDay, COUNT(*) AS TotalAdoptions
FROM Adoption
GROUP BY AdoptionDay
ORDER BY TotalAdoptions DESC
LIMIT 5;


-- Each user to view their own order details (Eg: user1)
SELECT 
    o.OrderID,
    o.OrderDate,
    o.Status,
    s.Name AS StoreName,
    p.Name AS ProductName,
    od.Quantity,
    p.Price,
    (od.Quantity * p.Price) AS TotalPrice
FROM Orders o
JOIN OrderDetails od ON o.OrderID = od.OrderID
JOIN Product p ON od.ProductID = p.ProductID
JOIN Store s ON o.StoreID = s.StoreID
WHERE o.Username = 'user1';


-- Each user to view their cart details (Eg: user5)
SELECT 
    c.CartID,
    p.Name AS ProductName,
    sc.CategoryName AS Category,
    p.Price,
    c.Quantity,
    (c.Quantity * p.Price) AS TotalPrice,
    s.Name AS StoreName
FROM Cart c
JOIN Product p ON c.ProductID = p.ProductID
JOIN ShoppingCategory sc ON p.CategoryID = sc.CategoryID
JOIN Supplies sup ON p.ProductID = sup.ProductID
JOIN Store s ON sup.StoreID = s.StoreID
WHERE c.Username = 'user5';


-- Search functionality based on shopping category (eg: Treats)
SELECT 
    p.ProductID,
    p.Name AS ProductName,
    sc.CategoryName,
    p.Price,
    pt.PetTypeName
FROM Product p
JOIN ShoppingCategory sc ON p.CategoryID = sc.CategoryID
JOIN PetType pt ON p.PetTypeID = pt.PetTypeID
WHERE sc.CategoryID IN (SELECT CategoryID FROM ShoppingCategory WHERE CategoryName = 'Food & Treats');


-- Find pet stores which put up dogs for adoption(Filter basis on pet type)
SELECT DISTINCT S.*
FROM Store S
JOIN Availability A ON S.StoreID = A.StoreID
JOIN Breed B ON A.BreedID = B.BreedID
JOIN PetType PT ON B.PetTypeID = PT.PetTypeID
WHERE PT.PetTypeName = 'Dog';


-- -- Add column named State in Users Table having default value Unknown
-- ALTER TABLE Users
-- ADD COLUMN State VARCHAR(100) NOT NULL DEFAULT 'Unknown';


-- -- Add column named State in Vet Table having default value Unknown
-- ALTER TABLE Vet
-- ADD COLUMN State VARCHAR(100) NOT NULL DEFAULT 'Unknown';


-- -- Add column named State in Store Table having default value Unknown
-- ALTER TABLE Store
-- ADD COLUMN State VARCHAR(100) NOT NULL DEFAULT 'Unknown';

--Filtering products based on category and pet type in descending order of price
SELECT Prod.name as PRODUCT_NAME, prod.price as PRICE, shop_cat.CategoryName as CATEGORY, ptype.PetTypeName as Pet_Type from
Product as prod
JOIN ShoppingCategory as shop_cat on prod.CategoryID=shop_cat.CategoryID
JOIN PetType as ptype on prod.PetTypeID=ptype.PetTypeID
WHERE shop_cat.CategoryName='Food & Treats' and 
ptype.PetTypeName='Dog'
ORDER BY prod.price desc; 




-- All pets with breed and pet type
select pt.pettypename as PetName, bd.breedname as BreedName, p.gender as Gender, p.age as Pet_Age from 
Pet as p
Join pettype as pt on p.PetTypeID= pt.PetTypeID
Join Breed as bd on p.BreedId=bd.BreedID;

-- Number of pets available for adoption of each pettype in each state 
SELECT ps.state AS State, pt.pettypename AS PetType, SUM(a.Available) AS TotalAvailablePets
FROM Availability a
JOIN Breed b ON a.breedid = b.breedid
JOIN PetType pt ON b.pettypeid = pt.pettypeid
JOIN Store ps ON a.storeid = ps.storeid
GROUP BY ps.state, pt.pettypename
ORDER BY ps.state, PetType;

-- Adopted Pets and their owner details 
SELECT u.name, u.phone, u.email, b.breedname AS Breed, pt.pettypename AS PetType, p.age, p.gender
FROM Adoption ad
JOIN Users u ON ad.username = u.username
JOIN Pet p ON ad.petid = p.petid
JOIN Breed b ON p.breedid = b.breedid
JOIN PetType pt ON b.pettypeid = pt.pettypeid;

