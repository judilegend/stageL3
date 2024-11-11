-- View for task status counts per sprint
CREATE VIEW vw_sprint_task_status AS
SELECT 
    t.sprintId,
    COUNT(t.id) as total_tasks,
    SUM(CASE t.status WHEN 'done' THEN 1 ELSE 0 END) as completed_tasks,
    SUM(CASE t.status WHEN 'in_progress' THEN 1 ELSE 0 END) as in_progress_tasks,
    SUM(CASE t.status WHEN 'review' THEN 1 ELSE 0 END) as review_tasks,
    SUM(CASE t.status WHEN 'todo' THEN 1 ELSE 0 END) as todo_tasks
FROM 
    Sprints s
    LEFT JOIN Taches t ON s.id = t.sprintId
GROUP BY 
    t.sprintId;

DELIMITER //

-- Stored procedure for updating sprint progress
CREATE PROCEDURE sp_update_sprint_progress(IN p_sprint_id INT)
BEGIN
    DECLARE v_progress DECIMAL(5,2);
    DECLARE v_total_tasks INT;
    DECLARE v_completed_tasks INT;
    
    -- Calculate progress based on task status weights
    SELECT 
        COALESCE(
            ROUND(
                (
                    (completed_tasks * 100) + 
                    (in_progress_tasks * 50) + 
                    (review_tasks * 75)
                ) / NULLIF(total_tasks, 0)
            , 0)
        , 0),
        total_tasks,
        completed_tasks
    INTO v_progress, v_total_tasks, v_completed_tasks
    FROM 
        vw_sprint_task_status
    WHERE 
        sprintId = p_sprint_id;

    -- Update sprint progress and status
    UPDATE Sprints 
    SET 
        progress = v_progress,
        status = CASE 
            WHEN v_total_tasks = 0 THEN 'planned'
            WHEN v_total_tasks = v_completed_tasks THEN 'completed'
            WHEN v_progress > 0 THEN 'in_progress'
            ELSE status
        END
    WHERE 
        id = p_sprint_id;
END //

-- Trigger for task status changes
CREATE TRIGGER trg_sprint_task_status_update
AFTER UPDATE ON Taches
FOR EACH ROW
BEGIN
    IF NEW.sprintId IS NOT NULL AND (OLD.status != NEW.status OR OLD.sprintId != NEW.sprintId) THEN
        CALL sp_update_sprint_progress(NEW.sprintId);
    END IF;
    
    IF OLD.sprintId IS NOT NULL AND OLD.sprintId != COALESCE(NEW.sprintId, 0) THEN
        CALL sp_update_sprint_progress(OLD.sprintId);
    END IF;
END //

-- Trigger for new tasks added to sprint
CREATE TRIGGER trg_sprint_task_insert
AFTER INSERT ON Taches
FOR EACH ROW
BEGIN
    IF NEW.sprintId IS NOT NULL THEN
        CALL sp_update_sprint_progress(NEW.sprintId);
    END IF;
END //

-- Trigger for tasks removed from sprint
CREATE TRIGGER trg_sprint_task_delete
AFTER DELETE ON Taches
FOR EACH ROW
BEGIN
    IF OLD.sprintId IS NOT NULL THEN
        CALL sp_update_sprint_progress(OLD.sprintId);
    END IF;
END //

DELIMITER ;
