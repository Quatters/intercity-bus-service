use intercity_bus_service;

-- --------------------------------------- --
-- Процедура, возвращающая свободные места --
-- на рейс с указанным flight_id.		   --
-- --------------------------------------- --
DELIMITER //
CREATE PROCEDURE GetFreeSeats(_flight_id INT)
BEGIN
DECLARE count INT;
-- Получаем вместимость автобуса из
-- справочника моделей автобуса.
SET count = (
	SELECT bm.seats_amount
    FROM flight f
    LEFT JOIN bus b ON b.bus_number = f.bus_number
    LEFT JOIN bus_model bm ON bm.model_id = b.model_id
    WHERE flight_id = _flight_id
);

IF count IS NOT NULL THEN
	-- Рекурсивно генерируем таблицу с полем
	-- seat_number, значения которой - числа
	-- от 1 до count.
	WITH RECURSIVE numbers AS (
		SELECT 1 AS seat_number
		UNION ALL
		SELECT seat_number + 1
		FROM numbers
		WHERE seat_number < count
	)
	SELECT seat_number FROM numbers
	-- Выбрасываем из полученной таблицы
	-- занятые места.
	WHERE seat_number NOT IN (
		SELECT seat_number
		FROM ticket
		WHERE flight_id = _flight_id
	);	
END IF;
END // 
