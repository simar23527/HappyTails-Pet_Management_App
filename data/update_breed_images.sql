-- Update breed images with verified working URLs
UPDATE Breed 
SET ImageURL = CASE 
    -- Dogs (all breeds from your database)
    WHEN BreedName = 'Labrador Retriever' THEN 'https://upload.wikimedia.org/wikipedia/commons/3/34/Labrador_on_Quantock.jpg'
    WHEN BreedName = 'Golden Retriever' THEN 'https://upload.wikimedia.org/wikipedia/commons/b/bd/Golden_Retriever_Dukedestiny01.jpg'
    WHEN BreedName = 'German Shepherd' THEN 'https://upload.wikimedia.org/wikipedia/commons/d/d0/German_Shepherd_-_DSC_0346.jpg'
    WHEN BreedName = 'Bulldog' THEN 'https://upload.wikimedia.org/wikipedia/commons/c/cf/English_Bulldog_Puppy.jpg'
    WHEN BreedName = 'Poodle' THEN 'https://upload.wikimedia.org/wikipedia/commons/f/f8/Full_attention.jpg'
    WHEN BreedName = 'Beagle' THEN 'https://upload.wikimedia.org/wikipedia/commons/5/55/Beagle_600.jpg'
    WHEN BreedName = 'Dachshund' THEN 'https://upload.wikimedia.org/wikipedia/commons/2/27/Short-haired-Dachshund.jpg'
    WHEN BreedName = 'Siberian Husky' THEN 'https://upload.wikimedia.org/wikipedia/commons/a/a3/Black-Magic-Sibirski-Husky.jpg'
    WHEN BreedName = 'Boxer' THEN 'https://upload.wikimedia.org/wikipedia/commons/6/6f/Male_fawn_Boxer_undocked.jpg'
    WHEN BreedName = 'Shih Tzu' THEN 'https://cdn.britannica.com/72/176872-050-F6A05749/Shih-tzu.jpg'
    WHEN BreedName = 'Pug' THEN 'https://upload.wikimedia.org/wikipedia/commons/f/f0/Mops_oct09_cropped2.jpg'
    WHEN BreedName = 'Rottweiler' THEN 'https://upload.wikimedia.org/wikipedia/commons/2/26/Rottweiler_standing_facing_left.jpg'
    WHEN BreedName = 'Doberman Pinscher' THEN 'https://upload.wikimedia.org/wikipedia/commons/9/9f/Dobermann_brown.jpg'
    WHEN BreedName = 'Great Dane' THEN 'https://upload.wikimedia.org/wikipedia/commons/0/0c/Great_Dane_black_laying.jpg'
    WHEN BreedName = 'Chihuahua' THEN 'https://upload.wikimedia.org/wikipedia/commons/4/4c/Chihuahua1_bvdb.jpg'
    WHEN BreedName = 'Border Collie' THEN 'https://cdn.britannica.com/82/232782-050-8062ACFA/Border-Collie-dog.jpg'
    WHEN BreedName = 'Basset Hound' THEN 'https://cdn.britannica.com/78/232778-050-D3701AB1/Basset-Hound-dog.jpg'
    WHEN BreedName = 'Maltese' THEN 'https://upload.wikimedia.org/wikipedia/commons/9/94/Maltese_600.jpg'
    WHEN BreedName = 'Akita' THEN 'https://cdn.britannica.com/79/232779-050-0EE741E7/Akita-Inu-dog.jpg'
    WHEN BreedName = 'Cocker Spaniel' THEN 'https://cdn.britannica.com/84/12884-050-2D307208/English-cocker-spaniel.jpg'
    WHEN BreedName = 'Saint Bernard' THEN 'https://upload.wikimedia.org/wikipedia/commons/2/22/Saint_Bernard_dog.jpg'
    WHEN BreedName = 'Samoyed' THEN 'https://upload.wikimedia.org/wikipedia/commons/1/18/Samojed00.jpg'
    WHEN BreedName = 'Dalmatian' THEN 'https://cdn.britannica.com/84/232784-050-1769B477/Dalmatian-dog.jpg'
    WHEN BreedName = 'Shiba Inu' THEN 'https://upload.wikimedia.org/wikipedia/commons/6/6b/Taka_Shiba.jpg'
    WHEN BreedName = 'Australian Shepherd' THEN 'https://cdn.britannica.com/07/234207-050-0437DA34/Australian-Shepherd-dog.jpg'

    -- Cats
    WHEN BreedName = 'Persian Cat' THEN 'https://upload.wikimedia.org/wikipedia/commons/8/8a/Persian_Cat.jpg'
    WHEN BreedName = 'Siamese Cat' THEN 'https://upload.wikimedia.org/wikipedia/commons/2/25/Seal_point_Siamese.jpg'
    WHEN BreedName = 'Maine Coon' THEN 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Maine_Coon_female.jpg'
    WHEN BreedName = 'Bengal Cat' THEN 'https://upload.wikimedia.org/wikipedia/commons/b/b5/Bengal_Cat.jpg'
    WHEN BreedName = 'Ragdoll Cat' THEN 'https://upload.wikimedia.org/wikipedia/commons/7/70/Ragdoll_Cat.jpg'
    WHEN BreedName = 'British Shorthair' THEN 'https://upload.wikimedia.org/wikipedia/commons/7/7f/British_Shorthair.jpg'
    WHEN BreedName = 'Sphynx' THEN 'https://upload.wikimedia.org/wikipedia/commons/b/b6/Sphynx_cat.jpg'
    WHEN BreedName = 'Russian Blue' THEN 'https://upload.wikimedia.org/wikipedia/commons/4/4a/Russian_Blue.jpg'

    -- Birds
    WHEN BreedName = 'Parrot' THEN 'https://upload.wikimedia.org/wikipedia/commons/6/6d/Blue-and-yellow-macaw.jpg'
    WHEN BreedName = 'Canary' THEN 'https://upload.wikimedia.org/wikipedia/commons/3/3f/Yellow_Canary.jpg'
    WHEN BreedName = 'Cockatoo' THEN 'https://upload.wikimedia.org/wikipedia/commons/c/cc/Sulphur-crested_Cockatoo.jpg'
    WHEN BreedName = 'Budgerigar' THEN 'https://upload.wikimedia.org/wikipedia/commons/7/7a/Budgerigar.jpg'
    WHEN BreedName = 'Cockatiel' THEN 'https://upload.wikimedia.org/wikipedia/commons/c/cf/Cockatiel.jpg'
    WHEN BreedName = 'African Grey Parrot' THEN 'https://upload.wikimedia.org/wikipedia/commons/d/d4/African_Grey_Parrot.jpg'

    -- Fish
    WHEN BreedName = 'Goldfish' THEN 'https://upload.wikimedia.org/wikipedia/commons/8/8f/Goldfish_in_aquarium.jpg'
    WHEN BreedName = 'Betta Fish' THEN 'https://upload.wikimedia.org/wikipedia/commons/9/9d/Betta_splendens.jpg'
    WHEN BreedName = 'Koi Fish' THEN 'https://upload.wikimedia.org/wikipedia/commons/f/f5/Koi_fish.jpg'
    WHEN BreedName = 'Guppy' THEN 'https://upload.wikimedia.org/wikipedia/commons/c/c5/Guppy_Fish.jpg'
    WHEN BreedName = 'Angelfish' THEN 'https://upload.wikimedia.org/wikipedia/commons/1/1c/Angelfish.jpg'
    WHEN BreedName = 'Clownfish' THEN 'https://upload.wikimedia.org/wikipedia/commons/a/ad/Clownfish.jpg'

    ELSE NULL -- Reset any invalid URLs to NULL
END; 